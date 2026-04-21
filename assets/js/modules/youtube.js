"use strict";

const ytVideoIds = ["Yun0Dsb3AtA", "NI7WALIXStU", "O3k277TKgws", "Gl2sWYUez3M", "3zpdGy0QCi8"];
let currentYtPlayer = null;
let secondsWatched = 0;
let watchTimer = null;

// โหลด YouTube API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    loadRandomVideo();
    checkKeyExpiration();
}

function loadRandomVideo() {
    const randomId = ytVideoIds[Math.floor(Math.random() * ytVideoIds.length)];
    currentYtPlayer = new YT.Player('yt-player-div', {
        videoId: randomId,
        playerVars: { 'playsinline': 1, 'controls': 1, 'modestbranding': 1 },
        events: { 'onStateChange': onPlayerStateChange }
    });
}

function playUnlockVideo() {
    if (currentYtPlayer && typeof currentYtPlayer.playVideo === 'function') {
        currentYtPlayer.playVideo();
        const btn = document.getElementById('btn-unlock');
        btn.innerText = "WATCHING...";
        btn.disabled = true;
    }
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        if (watchTimer) clearInterval(watchTimer);
        watchTimer = setInterval(() => { secondsWatched++; }, 1000);
    } else if (event.data == YT.PlayerState.ENDED) {
        clearInterval(watchTimer);
        if (secondsWatched >= (currentYtPlayer.getDuration() - 5)) {
            processKeyUnlock();
        } else {
            alert("Skipping detected! Watch the full video.");
            location.reload();
        }
    }
}

async function processKeyUnlock() {
    try {
        const data = await apiFetch("/api/key/generate", "POST", { plan: "termux" });
        if(data.ok) {
            localStorage.setItem("sn_api_key", data.key);
            localStorage.setItem("sn_key_expire", Date.now() + (12*60*60*1000));
            location.reload();
        }
    } catch(e) { console.error("Key Gen Error"); }
}

function checkKeyExpiration() {
    const role = localStorage.getItem("sn_role");
    if (role === 'owner' || role === 'admin' || role === 'ADMIN') {
        document.getElementById("termux-key").value = "HM-TRMX-OWNER-BYPASS";
        document.getElementById("btn-unlock").innerText = "OWNER ACTIVE";
        document.getElementById("btn-unlock").disabled = true;
        return;
    }

    const exp = localStorage.getItem("sn_key_expire");
    const key = localStorage.getItem("sn_api_key");
    if (exp && key && Date.now() < Number(exp)) {
        document.getElementById("termux-key").value = key;
        document.getElementById("btn-unlock").innerText = "KEY ACTIVE";
        document.getElementById("btn-unlock").disabled = true;
    }
}

function copyKey() {
    const key = document.getElementById("termux-key").value;
    if(key.includes("WATCH")) return;
    navigator.clipboard.writeText(key);
    showToast("Key Copied!");
}
ี
