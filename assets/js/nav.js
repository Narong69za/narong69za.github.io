document.addEventListener("DOMContentLoaded", function() {
    const navHTML = `
    <header class="fixed top-0 left-0 w-full z-[200] p-4 flex justify-center">
        <nav class="glass rounded-full px-10 py-4 flex justify-center items-center border border-white/5 shadow-2xl">
            <div class="flex gap-10 md:gap-14 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                <a href="index.html" class="hover:text-[#00ffd5] transition-colors">Monitor</a>
                <a href="create.html" class="hover:text-[#00ffd5] transition-colors">AI ENGINES</a>
                <a href="gen-video.html" class="hover:text-blue-500 transition-colors">Video AI</a>
                <a href="templates.html" class="hover:text-white transition-colors">Templates</a>
            </div>
        </nav>
    </header>
    <style>
        .glass { background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
    </style>
    `;
    const placeholder = document.getElementById("nav") || document.getElementById("nav-placeholder");
    if(placeholder) placeholder.innerHTML = navHTML;
    else document.body.insertAdjacentHTML("afterbegin", navHTML);
});
