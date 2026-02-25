// ======================================================
// ULTRA ENGINE - GREEN GLOW CONTROL FINAL
// SAFE VERSION - EVENT DELEGATION
// ======================================================

(function(){

    let activeButton = null;

    // selector รวมปุ่มทั้งหมด
    const TARGET_SELECTOR =
        ".model-btn, .cta-btn, .engine-btn";

    // ===============================
    // APPLY GLOW
    // ===============================

    function applyGlow(target){

        if(!target) return;

        // remove old
        if(activeButton){

            activeButton.classList.remove("active");

        }

        // set new
        activeButton = target;

        activeButton.classList.add("active");

    }

    // ===============================
    // GLOBAL CLICK LISTENER
    // (รองรับ DOM ที่ inject ทีหลัง)
    // ===============================

    document.addEventListener("click", function(e){

        const btn = e.target.closest(TARGET_SELECTOR);

        if(!btn) return;

        applyGlow(btn);

    });

    // ===============================
    // OPTIONAL API (เผื่อเรียกเอง)
    // ===============================

    window.setEngineGlow = function(selector){

        const btn = document.querySelector(selector);

        applyGlow(btn);

    };

})();
