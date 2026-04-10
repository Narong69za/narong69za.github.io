/**
 * SN DESIGN STUDIO - ORIGINAL NAVIGATION
 * แก้ไข: จัดกึ่งกลางเป๊ะ ไม่ล้นจอ และรักษาสมดุลลิขสิทธิ์ดั้งเดิม
 */
document.addEventListener("DOMContentLoaded", function() {
    const navHTML = `
    <header class="fixed top-0 left-0 w-full z-[200] p-4 flex justify-center">
        <nav class="glass rounded-full px-8 py-3 flex justify-center items-center border border-white/5 shadow-2xl">
            <div class="flex gap-6 md:gap-14 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">
                <a href="index.html" class="hover:text-[#00ffd5] transition-colors">Monitor</a>
                <a href="create.html" class="hover:text-[#00ffd5] transition-colors">AI ENGINES</a>
                <a href="gen-video.html" class="hover:text-[#00ffd5] transition-colors">Video AI</a>
                <a href="templates.html" class="hover:text-[#00ffd5] transition-colors">Templates</a>
            </div>
        </nav>
    </header>
    <style>
        .glass { background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
        @media (max-width: 640px) {
            .flex.gap-6 { gap: 1rem; }
            .text-\[10px\] { font-size: 8px; }
            nav { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
    </style>
    `;
    const placeholder = document.getElementById("nav") || document.getElementById("nav-placeholder");
    if(placeholder) placeholder.innerHTML = navHTML;
    else document.body.insertAdjacentHTML("afterbegin", navHTML);
});
