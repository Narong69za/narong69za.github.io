(function() {
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('token') || localStorage.getItem('token');

    // [1] จัดการ Token
    if (urlParams.get('token')) {
        localStorage.setItem('token', urlParams.get('token'));
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    async function initNav() {
        // สร้าง Global Nav ก่อนเพื่อความสวยงาม
        injectGlobalNav();
        
        if (!token) return;

        try {
            const res = await fetch('https://api.sn-designstudio.dev/auth/me', {
                method: 'GET',
                headers: { 'x-session-id': `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.ok && data.user) {
                updateUserUI(data.user);
            }
        } catch (err) { console.error("Nav Init Error:", err); }
    }

    function injectGlobalNav() {
        if(document.querySelector(".global-nav")) return;
        const navHTML = `
            <header class="global-nav">
                <nav class="nav-wrap">
                    <div class="nav-menu">
                        <a href="index.html">Home</a>
                        <a href="dashboard-v2.html" id="nav-gen">Generate AI</a> <a href="payment.html">Packages</a>
                        <a href="admin/payment.dashboard.html" id="nav-admin" style="display:none; color:#ff3366;">Admin Panel</a>
                    </div>
                </nav>
            </header>
        `;
        document.body.insertAdjacentHTML("afterbegin", navHTML);
        setActiveNav();
    }

    function updateUserUI(user) {
        // แสดงปุ่ม Admin ถ้าเป็นสิทธิ์ที่ถูกต้อง
        const role = (user.role || '').toLowerCase();
        if (role === 'admin' || role === 'dev') {
            const adminBtn = document.getElementById('nav-admin');
            if(adminBtn) adminBtn.style.display = 'inline-block';
        }
        
        // อัปเดตข้อมูล Credit (ถ้ามี Element)
        const credEl = document.getElementById('userCredits');
        if(credEl) credEl.innerText = (user.credits ?? 0).toLocaleString();
    }

    function setActiveNav() {
        const path = window.location.pathname.toLowerCase();
        document.querySelectorAll(".nav-menu a").forEach(link => {
            const href = link.getAttribute("href").toLowerCase();
            if(path.endsWith(href)) link.classList.add("nav-active");
        });
    }

    window.addEventListener('DOMContentLoaded', initNav);
})();
