/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: assets/js/create-nav.js (UI INJECTOR VERSION)
 * DESCRIPTION: ดักรับ Token, หยอดข้อมูลโปรไฟล์ และสร้างแถบเมนูบนสุด (Original Optimized)
 * =====================================================
 */

(function() {
    // [1] ดักรับ Token ทันทีจาก URL หรือ LocalStorage
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('token') || localStorage.getItem('token');

    // ถ้ามาพร้อม Token ใหม่ใน URL ให้เก็บลงเครื่องทันที
    if (urlParams.get('token')) {
        localStorage.setItem('token', urlParams.get('token'));
        // เคลียร์ URL ให้สะอาด (ลบ query string ออก)
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    /**
     * ฟังก์ชันเริ่มต้นดึงข้อมูลจาก Backend
     */
    async function initDashboard() {
        if (!token) {
            console.warn("⚠️ No Token found. Navigation restricted.");
            return;
        }

        try {
            // เรียกใช้ API Master ที่เราพึ่งเปิดท่อไป
            const res = await fetch('https://api.sn-designstudio.dev/auth/me', {
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // ตรวจสอบสถานะการตอบกลับ
            if (res.status === 401) {
                console.error("❌ Token Expired or Invalid");
                // localStorage.removeItem('token'); // เลือกเปิดใช้งานหากต้องการให้ดีดออกเมื่อ Token หมดอายุ
                return;
            }

            const data = await res.json();

            if (data.ok && data.user) {
                const user = data.user;

                // [2] หยอดข้อมูลลงในบัตร (Email, Role, Credits)
                updateAccountUI(user);

                // [3] สร้างแถบเมนูด้านบน (Injection)
                injectTopNavigation(user);
            }
        } catch (err) {
            console.error("❌ Dashboard Init Error:", err);
        }
    }

    /**
     * หยอดข้อมูลลงใน Element ที่มี ID ตรงกับข้อมูล User
     */
    function updateAccountUI(user) {
        const mapping = {
            'userEmail': user.email,
            'userRole': (user.role || 'user').toUpperCase(),
            'userCredits': user.credits ?? 0,
            'userShort': user.email ? user.email.charAt(0).toUpperCase() : 'N'
        };

        for (const [id, val] of Object.entries(mapping)) {
            const el = document.getElementById(id);
            if (el) {
                el.innerText = val;
                // ถ้าเป็นเครดิต ให้ใส่สีเขียวเพื่อให้ดูเป็น SaaS
                if (id === 'userCredits') el.style.color = '#00ff88';
            }
        }
    }

    /**
     * ฟังก์ชันสร้างเมนูบาร์ (ซ้าย-ขวา) เข้าไปในหน้า HTML
     * ยึดโครงสร้างสไตล์เดิมของพาร์ทเนอร์
     */
    function injectTopNavigation(user) {
        let navBar = document.getElementById('sn-top-nav-bar');
        
        if (!navBar) {
            navBar = document.createElement('div');
            navBar.id = 'sn-top-nav-bar';
            
            // สไตล์ดั้งเดิมที่พาร์ทเนอร์ตั้งไว้ (ลอยอยู่บนสุด)
            navBar.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                padding: 15px 25px;
                position: fixed; /* เปลี่ยนจาก absolute เป็น fixed เพื่อให้เมนูตามลงมาเวลาเลื่อน */
                top: 0;
                left: 0;
                z-index: 9999;
                box-sizing: border-box;
                background: linear-gradient(to bottom, rgba(10,11,16,0.9) 0%, rgba(10,11,16,0) 100%);
                pointer-events: none;
            `;
            document.body.prepend(navBar);
        }

        // --- ปุ่มฝั่งซ้าย: เติมเครดิต ---
        const leftBtn = `
            <a href="payment.html" style="pointer-events:auto; text-decoration:none; background:linear-gradient(90deg, #00f2fe, #4facfe); color:black; padding:10px 20px; border-radius:30px; font-weight:bold; font-size:12px; box-shadow:0 0 15px rgba(0,242,254,0.4); display:flex; align-items:center; gap:8px; font-family: sans-serif;">
                <i class="fas fa-plus-circle"></i> เติมเครดิต
            </a>
        `;

        // --- ปุ่มฝั่งขวา: ระบบควบคุม (โชว์เฉพาะ DEV / ADMIN) ---
        let rightBtn = '';
        const role = (user.role || '').toLowerCase();
        if (role === 'admin' || role === 'dev') {
            rightBtn = `
                <a href="admin/payment.dashboard.html" style="pointer-events:auto; text-decoration:none; background:rgba(255,0,85,0.05); color:#ff0055; padding:10px 20px; border-radius:30px; font-weight:bold; font-size:12px; border:1px solid rgba(255,0,85,0.5); box-shadow:0 0 15px rgba(255,0,85,0.1); font-family: sans-serif; display:flex; align-items:center; gap:8px;">
                    <i class="fas fa-user-shield"></i> ระบบควบคุม
                </a>
            `;
        }

        navBar.innerHTML = leftBtn + rightBtn;
    }

    // รันเมื่อโหลดหน้าเว็บเสร็จ
    // ใช้ตรวจสอบทั้งแบบ DOMContentLoaded และ load เพื่อความชัวร์ว่า UI จะไม่หาย
    if (document.readyState === 'complete') {
        initDashboard();
    } else {
        window.addEventListener('load', initDashboard);
    }

})();
