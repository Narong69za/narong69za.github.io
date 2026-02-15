function isUserLogged(){

try{

const user = localStorage.getItem("sn_user");

if(!user) return false;

const data = JSON.parse(user);

if(data && typeof data === "object"){
return true;
}

return false;

}catch(e){
return false;
}

}

function sessionCheck(){

const logged = isUserLogged();

if(logged){
console.log("SESSION OK");
return;
}

console.log("LOGIN REQUIRED");

setTimeout(()=>{

alert("กรุณาเข้าสู่ระบบก่อนใช้งาน");

},500);

}

window.addEventListener("load",sessionCheck);
