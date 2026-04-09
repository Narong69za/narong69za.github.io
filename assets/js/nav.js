/**
 * SN ULTRA CORE - NAV v9 (Centered & Mobile Fixed)
 */
document.addEventListener("DOMContentLoaded", function() {
    const navHTML = `
    <header class="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] md:w-full max-w-7xl z-[200]">
        <nav class="glass rounded-full px-4 py-3 md:px-10 md:py-5 flex justify-between items-center border border-white/10 shadow-2xl">
            <div class="text-white font-black italic tracking-tighter text-xs md:text-xl uppercase flex-shrink-0">
                SN ULTRA <span class="text-[#00ffd5]">CORE</span>
            </div>
            <div class="flex gap-3 md:gap-8 text-[8px] md:text-[11px] font-black uppercase tracking-widest text-slate-400">
                <a href="index.html" class="hover:text-[#00ffd5] transition-colors">Monitor</a>
                <a href="create.html" class="hover:text-[#00ffd5] transition-colors">AI ENGINES</a>
                <a href="gen-video.html" class="hover:text-white transition-colors">Video AI</a>
            </div>
        </nav>
    </header>
    <style>
        .glass { background: rgba(0,0,0,0.8); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); }
    </style>
    `;

    const placeholder = document.getElementById("nav") || document.getElementById("nav-placeholder");
    if(placeholder) placeholder.innerHTML = navHTML;
    else document.body.insertAdjacentHTML("afterbegin", navHTML);
});
