// =====================================================
// CREATE PAGE JS
// ULTRA CLEAN BUILD
// RESPONSIBILITY:
// - nav UI only
// - redirect payment center only
// - NO payment logic
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    if(document.querySelector(".create-top-nav")) return;

    const nav = document.createElement("div");

    nav.className = "create-top-nav";

    nav.innerHTML = `
        <div class="create-nav-left">
            ⭐ SN DESIGN ENGINE AI
        </div>

        <div class="create-nav-right">
            <button id="btn-credit" class="create-nav-btn">
                เติมเครดิต
            </button>
        </div>
    `;

    document.body.prepend(nav);

});

// ONLY redirect payment center

document.addEventListener("click",(e)=>{

    if(e.target.id === "btn-credit"){

        window.location.href="/payment.html";

    }

});
