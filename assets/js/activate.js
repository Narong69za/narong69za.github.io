/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: LICENSE GENERATOR ENGINE
 * VERSION: 1.1.0
 * STATUS: ACTIVE
 * LAST FIX: ADD HWID URL BINDING (ADD ONLY)
 * =====================================================
 */

/**
 * =====================================================
 * ADDITION MODULE: HWID URL READER
 * PURPOSE: READ DEVICE ID FROM BOT REDIRECT
 * =====================================================
 */

function getHWID(){

const params=new URLSearchParams(window.location.search)

const hwid=params.get("hwid")

if(hwid){
return hwid
}

return navigator.userAgent.slice(0,10)

}

/**
 * =====================================================
 * AUTO LOAD HWID INTO FIELD (IF EXIST)
 * =====================================================
 */

window.addEventListener("load",function(){

const hwid=getHWID()

const hwidInput=document.getElementById("hwid")

if(hwidInput){

hwidInput.value=hwid

}

})


function generatePRO(){

const device=getHWID()

const date=new Date().toISOString().split("T")[0]

const key="SN-PRO-"+device+"-"+date+"-30D"

document.getElementById("generated-key").value=key

}


function generatePREMIUM(){

const device=getHWID()

const date=new Date().toISOString().split("T")[0]

const key="SN-PREMIUM-"+device+"-"+date+"-30D"

document.getElementById("generated-key").value=key

}


/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: ACTIVATE CLIENT ENGINE
 * VERSION: 1.2.0
 * STATUS: ACTIVE
 * LAST FIX: HWID API BINDING (ADD ONLY)
 * =====================================================
 */

const API_ENDPOINT="/api/activate";

async function activateKey(){

const key=document.getElementById("activate-key").value;

if(!key){
alert("กรุณาใส่ Activation Key");
return;
}

try{

const hwid=getHWID()

const res=await fetch(API_ENDPOINT,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
key:key,
device_id:hwid
})
});

const data=await res.json();

if(data.status==="ok"){

alert("ระบบเปิดใช้งานสำเร็จ");

window.location.href="/create.html";

}

else if(data.status==="invalid_key"){

alert("Key ไม่ถูกต้อง");

}

else if(data.status==="expired"){

alert("Key หมดอายุ");

}

else if(data.status==="device_locked"){

alert("Key ถูกใช้งานกับเครื่องอื่น");

}

else{

alert("Activation Failed");

}

}catch(err){

console.error(err);
alert("API ERROR");

}

}

function copyKey(){

const key=document.getElementById("generated-key");

navigator.clipboard.writeText(key.value);

alert("คัดลอก Key แล้ว");

  }
