const API_BASE = window.ENV_API || "/api"

let player

function loadYouTube(){

const tag = document.createElement("script")
tag.src = "https://www.youtube.com/iframe_api"
document.body.appendChild(tag)

}

function onYouTubeIframeAPIReady(){

player = new YT.Player("player",{

height:"360",
width:"100%",
videoId:window.VIDEO_ID || "VIDEO_ID",

events:{
onStateChange:onPlayerStateChange
}

})

}

function onPlayerStateChange(event){

if(event.data === 0){
unlockActivation()
}

}

async function unlockActivation(){

document.getElementById("keyPanel").style.display="block"

try{

const res = await fetch(`${API_BASE}/activate`,{
method:"POST"
})

const data = await res.json()

renderKey(data)

}catch(e){

console.error(e)

}

}

function renderKey(data){

const key = data.key || "SN-XXXX-XXXX"

document.getElementById("key").innerText = key

const cmd = `./activate.sh ${key}`

document.getElementById("terminalCmd").innerText = cmd

}

function copyKey(){

const text = document.getElementById("key").innerText

navigator.clipboard.writeText(text)

alert("Activation key copied")

}

function copyCmd(){

const text = document.getElementById("terminalCmd").innerText

navigator.clipboard.writeText(text)

alert("Command copied")

}

document.addEventListener("DOMContentLoaded",()=>{

loadYouTube()

})
