/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: ACTIVATE CLIENT ENGINE
 * VERSION: 1.1.0
 * STATUS: ACTIVE
 * LAST FIX: API RESPONSE FIX
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
body:JSON.stringify({
key:key,
device_id:navigator.userAgent
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
