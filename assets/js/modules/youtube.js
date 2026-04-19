const ytVideoIds = ["Yun0Dsb3AtA", "NI7WALIXStU", "O3k277TKgws", "Gl2sWYUez3M", "3zpdGy0QCi8"];
let currentYtPlayer = null;
let watchTimer = null;
let secondsWatched = 0;
let requiredWatchTime = 0;

// โหลด YouTube Iframe API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    loadRandomVideo(); // โหลดวิดีโอเสมอเพื่อไม่ให้เป็นจอดำ
    checkKeyExpiration();
}

function loadRandomVideo() {
    const randomId = ytVideoIds[Math.floor(Math.random() * ytVideoIds.length)];
    if (currentYtPlayer) {
        currentYtPlayer.loadVideoById(randomId);
        currentYtPlayer.stopVideo(); 
    } else {
        currentYtPlayer = new YT.Player('yt-player-div', {
            videoId: randomId,
            playerVars: { 'playsinline': 1, 'controls': 0, 'disablekb': 1, 'rel': 0, 'fs': 0, 'modestbranding': 1 },
            events: { 'onStateChange': onPlayerStateChange }
        });
    }
    secondsWatched = 0;
}

function playUnlockVideo() {
    if (currentYtPlayer && typeof currentYtPlayer.playVideo === 'function') {
        currentYtPlayer.playVideo(); 
        showToast("Please watch until the end without skipping.", "warning");
        const btn = document.getElementById('btn-unlock');
        if(btn) {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin text-sm"></i> <span>Watching...</span>';
            btn.disabled = true; 
            btn.classList.replace('bg-red-600', 'bg-gray-600');
        }
    } else { 
        showToast("YouTube player is still loading...", "warning"); 
    }
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        requiredWatchTime = currentYtPlayer.getDuration() - 2; 
        if (watchTimer) clearInterval(watchTimer);
        watchTimer = setInterval(() => { 
            secondsWatched++; 
            if(secondsWatched >= requiredWatchTime && requiredWatchTime > 0) {
                clearInterval(watchTimer);
                processKeyUnlock();
            }
        }, 1000);
    } 
    else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.BUFFERING) {
        if (watchTimer) clearInterval(watchTimer);
    }
    else if (event.data == YT.PlayerState.ENDED) {
        if (watchTimer) clearInterval(watchTimer);
        if (secondsWatched >= requiredWatchTime && requiredWatchTime > 0) {
            processKeyUnlock(); 
        } else {
            showToast("System detected skipping. You must watch the full video.", "error");
            secondsWatched = 0; 
            currentYtPlayer.seekTo(0); 
            currentYtPlayer.stopVideo();
            resetUnlockButton();
        }
    }
}

function resetUnlockButton() {
    const btn = document.getElementById('btn-unlock');
    if(btn){
        btn.innerHTML = `<i class="fab fa-youtube text-sm"></i> <span id="txt-unlock">Generate Key</span>`;
        btn.disabled = false; 
        btn.classList.replace('bg-gray-600', 'bg-red-600');
    }
}

async function processKeyUnlock(){
    try{
        // ยิง API ขอ Key (ใช้ apiFetch จาก auth.js)
        const data = await apiFetch("/api/key/generate", "POST", {plan:"termux"});
        if(!data.success){ showToast("Generate key failed", "error"); return; }
        const key = data.key;
        const expireAt = Date.now() + (12*60*60*1000);
        localStorage.setItem("sn_api_key", key); 
        localStorage.setItem("sn_key_expire", expireAt);
        activateKeyUI(key); 
        updateTimer(expireAt);
        showToast("12-Hour Termux API Key Generated!", "success");
    }catch(e){ showToast("API key service offline", "error"); }
}

function checkKeyExpiration(){
    // ระบบ Bypass สำหรับ Owner หรือ Admin (ไม่ต้องดูวิดีโอ)
    const role = localStorage.getItem("sn_role");
    if(role === 'owner' || role === 'admin' || role === 'ADMIN') {
        activateKeyUI("HM-TRMX-OWNER-BYPASS");
        const kt = document.getElementById("key-timer");
        if(kt) kt.classList.add("hidden");
        return true;
    }

    const exp = localStorage.getItem("sn_key_expire");
    const key = localStorage.getItem("sn_api_key");
    if(exp && key && Date.now() < Number(exp)){
        activateKeyUI(key); 
        updateTimer(Number(exp)); 
        return true;
    }
    return false;
}

function activateKeyUI(key){
    const input = document.getElementById("termux-key");
    if(input){ 
        input.value = key; 
        input.classList.remove("text-gray-500"); 
        input.classList.add("text-cyan-300"); 
    }
    const btn = document.getElementById("btn-unlock");
    if(btn){ 
        btn.innerHTML = '<i class="fas fa-check-circle mr-2"></i> Key Active (12H)'; 
        btn.disabled = true; 
        btn.classList.remove("bg-red-600"); 
        btn.classList.add("bg-green-600"); 
    }
}

function updateTimer(expire){
    const wrap = document.getElementById("key-timer");
    if(wrap) wrap.classList.remove("hidden");
    if(window.timerInterval) clearInterval(window.timerInterval);
    window.timerInterval = setInterval(()=>{
        const diff = expire - Date.now();
        if(diff <= 0){
            clearInterval(window.timerInterval); 
            localStorage.removeItem("sn_api_key"); 
            localStorage.removeItem("sn_key_expire"); 
            location.reload(); 
            return;
        }
        const h = Math.floor(diff/1000/60/60); 
        const m = Math.floor((diff/1000/60)%60); 
        const s = Math.floor((diff/1000)%60);
        safeText("time-left", `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`);
    }, 1000);
}

function copyKey(){
    const key = document.getElementById("termux-key").value;
    if(!key || key.includes("WATCH") || key.includes("UNLOCK")){ 
        showToast("Watch video first", "error"); 
        return; 
    }
    navigator.clipboard.writeText(key); 
    showToast("Copied", "success");
}

