// =====================================================
// CREATE PAGE JS (CLEAN BUILD)
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    if(document.querySelector(".create-top-nav")) return;

    const nav = document.createElement("div");
    nav.className = "create-top-nav";
    nav.innerHTML = `
        <div class="create-nav-left">⭐ SN DESIGN ENGINE AI</div>
        <div class="create-nav-right">
            <button id="btn-credit" class="create-nav-btn">เติมเครดิต</button>
        </div>
    `;
    document.body.prepend(nav);
});

document.addEventListener("click", (e) => {
    if (e.target.id === "btn-credit") {
        window.location.href = "/payment.html";
    }
});

// UI Interactions
document.querySelectorAll(".mode-btn, .type-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const container = btn.closest(".engine-box") || btn.parentElement;
        container.querySelectorAll(".mode-btn, .type-btn").forEach(b => b.classList.remove("active-mode", "active-model"));
        btn.classList.add(btn.classList.contains("mode-btn") ? "active-mode" : "active-model");
    });
});

