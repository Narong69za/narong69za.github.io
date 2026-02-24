/* ===============================
ENGINE CORE STATE
=============================== */

let STATE={
engine:null,
model:null,
mode:null,
type:null
};

/* ===============================
ENGINE LOCK SYSTEM
=============================== */

function selectEngine(engine){

// block ถ้า engine เดิม
if(STATE.engine===engine) return;

STATE.engine=engine;
STATE.model=null;
STATE.mode=null;

// remove active ทั้งหมด
document.querySelectorAll(".engine-active")
.forEach(el=>el.classList.remove("engine-active"));

/* activate engine เดียว */
if(engine==="replicate"){
document.querySelector(".engine.red")
?.classList.add("engine-active");
}

if(engine==="runway"){
document.querySelector(".engine.blue")
?.classList.add("engine-active");
}

updateStatus();

}

/* ===============================
MODEL SELECT (LOCK PER ENGINE)
=============================== */

document.querySelectorAll("[data-model]").forEach(btn=>{

btn.addEventListener("click",()=>{

const engineType = btn.closest(".engine").classList.contains("red")
? "replicate"
: "runway";

/* auto switch engine */
selectEngine(engineType);

/* clear model active */
document.querySelectorAll("[data-model]")
.forEach(b=>b.classList.remove("active-model"));

btn.classList.add("active-model");

STATE.model = btn.dataset.model;

updateStatus();

});

});

/* ===============================
STATUS UPDATE
=============================== */

function updateStatus(){

const status=document.getElementById("status-text");

if(!status) return;

status.innerText=
`ENGINE - ${STATE.engine||"-"} | MODEL - ${STATE.model||"-"} | MODE - ${STATE.mode||"-"} | TYPE - ${STATE.type||"-"}`;

}
