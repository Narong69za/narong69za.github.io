/**
 * =====================================================
 * MODULE: assets/js/create-nav.js
 * VERSION: v14.0.1 (STABLE & TYPO FIXED)
 * =====================================================
 */
const API_BASE = "https://api.sn-designstudio.dev";

async function loadUserStatus() {
    if (window.isAuthChecked) return;
    const userDisplay = document.getElementById("user-display");
    const authStatusBtn = document.getElementById("auth-status-btn");
    const adminBtn = document.getElementById("btn-admin");

    try {
        const res = await fetch(`${API_BASE}/auth/me`, {
            credentials: "include",
            headers: { "Accept": "application/json" }
        });

        if (res.status === 401) {
            console.warn("üö Unauthorized!");
            if (!window.location.pathname.includes("login.html")) {
                window.location.replace("/login.html");
            }
            return;
        }

        const data = await res.json();
        if (data && data.ok && data.user) {
            const user = data.user;
            if (userDisplay) {
                userDisplay.innerHTML = `<span>${user.email.split('@')[0]}</span> | <span style="color:#00ffd5">üí ${user.credits || 0}</span>`;
            }
            if (authStatusBtn) {
                authStatusBtn.innerText = "ONLINE";
                authStatusBtn.style.background = "linear-gradient(45deg, #00ffd5, #0088ff)";
            }
            if ((user.role === "admin" || user.role === "owner") && adminBtn) {
                adminBtn.style.display = "flex";
            }
            window.isAuthChecked = true;
        }
    } catch (err) {
        console.error("‚ö†Ô∏è Auth check connection issue");
    }
}
document.addEventListener("DOMContentLoaded", loadUserStatus);

