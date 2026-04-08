document.addEventListener("DOMContentLoaded", function() {
    const navHTML = `
    <header class="fixed top-0 left-0 w-full z-[100] p-6">
        <nav class="max-w-7xl mx-auto glass rounded-full px-8 py-4 flex justify-between items-center border border-white/5 shadow-2xl">
            <div class="text-white font-black italic tracking-tighter text-lg">SN ULTRA <span class="text-[#00ffd5]">COMMAND</span></div>
            <div class="flex gap-10 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                <a href="index.html" class="hover:text-[#00ffd5] transition-colors">Monitor</a>
                <a href="gen-video.html" class="hover:text-[#3b82f6] transition-colors">Video AI</a>
                <a href="gen-image.html" class="hover:text-[#10b981] transition-colors">Image AI</a>
                <a href="templates.html" class="hover:text-white transition-colors">Templates</a>
            </div>
        </nav>
    </header>
    <style>
        .glass { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(20px); }
    </style>
    `;
    const placeholder = document.getElementById("nav-placeholder");
    if(placeholder) placeholder.innerHTML = navHTML;
    else document.body.insertAdjacentHTML("afterbegin", navHTML);
});
