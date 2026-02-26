const API_BASE="https://sn-design-api.onrender.com";

const box=document.getElementById("paymentBox");
const status=document.getElementById("paymentStatus");

document.querySelectorAll(".pay-btn").forEach(btn=>{

btn.addEventListener("click",async()=>{

document.querySelectorAll(".pay-btn").forEach(b=>b.classList.remove("active"));
btn.classList.add("active");

const method=btn.dataset.method;

status.innerText="STATUS: LOADING";

try{

if(method==="stripe"){

const res=await fetch(API_BASE+"/api/stripe/create-checkout",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({product:"credit_pack_1"})
});

const data=await res.json();

window.location.href=data.url;

}

if(method==="promptpay"){

const res=await fetch(API_BASE+"/api/thaiqr/create",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ amount:49 })
});

const data=await res.json();

box.innerHTML=`<img src="${data.qr}" width="250">`;

status.innerText="WAITING PAYMENT...";

}

if(method==="truemoney"){

box.innerHTML="<p>TrueMoney Payment Init...</p>";

}

if(method==="crypto"){

box.innerHTML="<p>Crypto Payment Coming...</p>";

}

}catch(e){

status.innerText="ERROR";

}

});

});
