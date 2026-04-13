const navData = {
    th: {
        home: "หน้าแรก",
        create: "สร้างรูปภาพ AI (14 Models)",
        service: "ศูนย์บริการ & บอท",
        topup: "เติมเงิน",
        dev: "พัฒนาโดย: ต้องดีแค่ไหน โลกถึงจะจำ"
    },
    en: {
        home: "HOME",
        create: "AI CREATE (14 MODELS)",
        service: "SERVICE HUB & BOTS",
        topup: "TOPUP",
        dev: "DEV: THE REMEMBERED ONE"
    }
};

function renderNav() {
    const lang = localStorage.getItem('lang') || 'th';
    const isAdmin = localStorage.getItem('user_email') === 'narongsack.69@gmail.com';
    
    const navHtml = `
    <nav class="w-full bg-[#080808] border-b border-white/5 p-4 flex justify-between items-center sticky top-0 z-[100]">
        <div class="flex items-center gap-6">
            <div class="text-xl font-black italic text-white tracking-tighter">SN ULTRA</div>
            <div class="header-links flex gap-6">
                <a href="index.html" class="text-[10px] font-black uppercase hover:text-blue-500">${navData[lang].home}</a>
                <a href="create.html" class="text-[10px] font-black uppercase hover:text-blue-500 border-b border-blue-500/50">${navData[lang].create}</a>
                <a href="multi-board.html" class="text-[10px] font-black uppercase hover:text-blue-500">${navData[lang].service}</a>
            </div>
        </div>
        <div class="flex items-center gap-4">
            <p class="hidden lg:block text-[10px] font-black italic text-gray-500">${navData[lang].dev}</p>
            <div class="flex gap-1">
                <button onclick="setLang('th')" class="px-2 py-1 text-[9px] border border-white/10 rounded">TH</button>
                <button onclick="setLang('en')" class="px-2 py-1 text-[9px] border border-white/10 rounded">EN</button>
            </div>
        </div>
    </nav>
    `;
    document.getElementById('nav-container').innerHTML = navHtml;
}

function setLang(l) {
    localStorage.setItem('lang', l);
    location.reload();
}

document.addEventListener('DOMContentLoaded', renderNav);
