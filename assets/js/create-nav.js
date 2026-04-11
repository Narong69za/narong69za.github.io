/**
 * MODULE: create-nav.js (MASTER SECURITY & NAV)
 */

const API_BASE = "https://api.sn-designstudio.dev"; // มั่นใจว่าตรงกับ Backend

(function buildNav() {
    if(document.querySelector(".create-top-nav")) return;

    const nav = document.createElement("div");
    nav.className = "create-top-nav";
    nav.innerHTML = `
        <div class="create-nav-left">⭐ SN DESIGN ENGINE AI</div>
        <div class="create-nav-right">
            <span id="user-display" style="margin-right:15px; font-size:12px; color:#00ffd5;"></span>
            <button id="btn-credit" class="credit-btn-premium" style="display:none;">เติมเครดิต</button>
            <button id="btn-admin" class="credit-btn-premium" style="display:none;">⚙ PAYMENT CONTROL</button>
        </div>
    `;
    document.body.prepend(nav);
})();

async function loadUserStatus() {
    const creditBtn = document.getElementById("btn-credit");
    const adminBtn  = document.getElementById("btn-admin");
    const userDisp  = document.getElementById("user-display");

    try {
        const res = await fetch(`${API_BASE}/auth/me`, {
            credentials: "include", // สำคัญมาก: เพื่อส่ง JWT Cookie
            cache: "no-store"
        });

        if (!res.ok) {
            // ถ้า Backend ตอบ 401 หรือ NO_TOKEN ให้เด้งไป Login
            if (res.status === 401) window.location.href = "/login.html";
            return;
        }

        const user = await res.json();
        if(userDisp && user.displayName) userDisp.innerText = `USER: ${user.displayName}`;

        const role = (user.role || "").toLowerCase();
        
        // OWNER CONTROL
        if (role === "owner") {
            if(creditBtn) creditBtn.style.display = "inline-block";
            if(adminBtn)  adminBtn.style.display = "inline-block";
        } else {
            if(creditBtn) creditBtn.style.display = "inline-block";
        }
    } catch (err) {
        console.warn("AUTH CHECK FAILED:", err);
    }
}

document.addEventListener("DOMContentLoaded", loadUserStatus);

// Navigation Click Handler
document.addEventListener("click", (e) => {
    if (e.target.id === "btn-credit") window.location.href = "/payment.html";
    if (e.target.id === "btn-admin") window.location.href = "/payment-control.html";
});

