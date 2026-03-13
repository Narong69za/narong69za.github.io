/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: ACTIVATE CLIENT ENGINE
 * VERSION: 1.0.0
 * STATUS: ACTIVE
 * LAST FIX: API CONNECT + KEY COPY SYSTEM
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

const res=await fetch(API_ENDPOINT,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({key})
});

const data=await res.json();

if(data.success){
alert("ระบบเปิดใช้งานสำเร็จ");
}else{
alert("Key ไม่ถูกต้อง");
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
