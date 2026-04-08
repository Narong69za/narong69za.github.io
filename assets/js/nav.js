document.addEventListener("DOMContentLoaded", function() {
    const navHTML = `
    <header class="fixed top-0 left-0 w-full z-[200] p-6">
        <nav class="max-w-7xl mx-auto glass rounded-full px-10 py-5 flex justify-between items-center border border-white/5 shadow-2xl">
            <div class="text-white font-black italic tracking-tighter text-xl uppercase">SN ULTRA <span class="text-[#00ffd5]">CORE</span></div>
            <div class="flex gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                <a href="index.html" class="hover:text-[#00ffd5] transition-colors">Monitor</a>
                <a href="gen-video.html" class="hover:text-blue-500 transition-colors">Video AI</a>
                <a href="templates.html" class="hover:text-white transition-colors">Templates</a>
            </div>
        </nav>
    </header>
    `;
    const placeholder = document.getElementById("nav-placeholder");
    if(placeholder) placeholder.innerHTML = navHTML;
    else document.body.insertAdjacentHTML("afterbegin", navHTML);
});
