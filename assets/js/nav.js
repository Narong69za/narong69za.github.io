/* ===============================
   ULTRA NAV AUTO CORE V2.0
   =============================== */

document.addEventListener("DOMContentLoaded", function () {
    // 1. ป้องกันการฉีดซ้ำ
    if(document.querySelector(".global-nav")) return;

    // 2. สร้างโครงสร้าง Nav (ใช้ Path ที่เสถียร)
    const navHTML = `
    <header class="global-nav">
        <nav class="nav-wrap">
            <div class="nav-menu">
                <a href="index.html">Home</a>
                <a href="packages.html">Packages</a>
                <a href="services.html">Services</a>
                <a href="templates.html">Templates</a>
                <a href="seo.html">SEO</a>
                <a href="contact.html">Contact</a>
            </div>
        </nav>
    </header>
    `;

    document.body.insertAdjacentHTML("afterbegin", navHTML);

    // 3. ตรวจสอบ Active State โดยดูจากชื่อไฟล์
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    
    document.querySelectorAll(".nav-menu a").forEach(link => {
        const href = link.getAttribute("href");
        if(currentPath === href) {
            link.classList.add("nav-active");
        }
    });

    // 4. ระบบ Auto Hide เมื่อ Scroll
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
        const navEl = document.querySelector(".global-nav");
        if(!navEl) return;
        let currentScroll = window.pageYOffset;
        if (currentScroll > lastScroll && currentScroll > 80) {
            navEl.style.transform = "translateY(-100%)";
        } else {
            navEl.style.transform = "translateY(0)";
        }
        lastScroll = currentScroll;
    });
});
