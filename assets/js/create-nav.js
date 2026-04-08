/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: assets/js/create-nav.js (UNIFIED & OPTIMIZED)
 * DESCRIPTION: รักษาโครงสร้างเดิม 100% แต่แก้ปัญหา Timing และการแสดงผล
 * =====================================================
 */

(function() {
    // [1] ดักรับ Token ทันที (โครงสร้างเดิมของพี่)
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('token') || localStorage.getItem('token');

    if (urlParams.get('token')) {
        localStorage.setItem('token', urlParams.get('token'));
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    async function initDashboard() {
        if (!token) return;

        try {
            // ยึด Endpoint เดิมของพี่ (https://api.sn-designstudio.dev/auth/me)
            const res = await fetch('https://api.sn-designstudio.dev/auth/me', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await res.json();

            if (data.ok && data.user) {
                const user = data.user;
                updateAccountUI(user);
                injectTopNavigation(user);
            }
        } catch (err) {
            console.error("Dashboard Init Error:", err);
        }
    }

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
                // เสริมความสวยงามเล็กน้อยให้เครดิต
                if (id === 'userCredits') el.style.color = '#00ff88';
            }
        }
    }

    function injectTopNavigation(user) {
        let navBar = document.getElementById('sn-top-nav-bar');
        if (!navBar) {
            navBar = document.createElement('div');
            navBar.id = 'sn-top-nav-bar';
            
            // สไตล์ดั้งเดิม (ยึดตามที่พี่ต้องการ แต่ใช้ position: fixed เพื่อให้ไม่หายเวลาเลื่อน)
            navBar.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                padding: 15px 25px;
                position: fixed; 
                top: 0;
                left: 0;
                z-index: 9999;
                box-sizing: border-box;
                pointer-events: none;
                background: linear-gradient(to bottom, rgba(10,11,16,0.9) 0%, rgba(10,11,16,0) 100%);
            `;
            document.body.prepend(navBar);
        }

        const leftBtn = `
            <a href="payment.html" style="pointer-events:auto; text-decoration:none; background:linear-gradient(90deg, #00f2fe, #4facfe); color:black; padding:10px 22px; border-radius:30px; font-weight:bold; font-size:12px; box-shadow:0 0 20px rgba(0,242,254,0.4); display:flex; align-items:center; gap:8px; font-family: sans-serif; transition: transform 0.2s;">
                <i class="fas fa-plus-circle"></i> เติมเครดิต
            </a>
        `;

        let rightBtn = '';
        const role = (user.role || '').toLowerCase();
        if (role === 'admin' || role === 'dev') {
            rightBtn = `
                <a href="admin/payment.dashboard.html" style="pointer-events:auto; text-decoration:none; background:rgba(255,0,85,0.05); color:#ff0055; padding:10px 22px; border-radius:30px; font-weight:bold; font-size:12px; border:1px solid rgba(255,0,85,0.5); box-shadow:0 0 20px rgba(255,0,85,0.1); font-family: sans-serif; display:flex; align-items:center; gap:8px; transition: transform 0.2s;">
                    <i class="fas fa-user-shield"></i> ระบบควบคุม
                </a>
            `;
        }

        navBar.innerHTML = leftBtn + rightBtn;
    }

    // [แก้ปัญหาเมนูหาย] - ตรวจสอบการโหลดแบบครอบคลุม
    if (document.readyState === 'complete') {
        initDashboard();
    } else {
        window.addEventListener('load', initDashboard);
    }

})();
