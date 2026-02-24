console.log("CREATE JS LOADED");

let STATE = {
  engine:null,
  mode:null,
  type:null
};

const statusEl = document.querySelector("#status");


// ---------- TYPE BUTTON ----------

document.querySelectorAll(".type-btn").forEach(btn=>{

  btn.onclick = ()=>{

    document.querySelectorAll(".type-btn").forEach(b=>b.classList.remove("active"));

    btn.classList.add("active");

    STATE.type = btn.innerText;

    console.log("TYPE:",STATE.type);

  };

});


// ---------- ENGINE MODE ----------

document.querySelectorAll("button").forEach(btn=>{

  btn.onclick = (e)=>{

    const text = btn.innerText.toLowerCase();

    if(text.includes("dark") ||
       text.includes("lipsync") ||
       text.includes("dance") ||
       text.includes("face")){

      document.querySelectorAll("button").forEach(b=>b.classList.remove("active"));

      btn.classList.add("active");

      STATE.mode = btn.innerText;

      const parent = btn.closest("div");

      if(parent && parent.innerText.includes("RED")){
        STATE.engine="red";
      }

      if(parent && parent.innerText.includes("BLUE")){
        STATE.engine="blue";
      }

      console.log("ENGINE:",STATE.engine);
      console.log("MODE:",STATE.mode);

    }

  };

});


// ---------- GENERATE ----------

async function runGenerate(engine){

  console.log("CLICK GENERATE",engine);

  if(!STATE.mode){

    statusEl.innerText="STATUS: SELECT MODE";

    return;

  }

  statusEl.innerText="STATUS: PROCESSING...";

  try{

    const res = await fetch("/api/render",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        engine:engine,
        mode:STATE.mode,
        type:STATE.type
      })

    });

    const data = await res.json();

    console.log(data);

    statusEl.innerText="STATUS: DONE";

  }catch(err){

    console.error(err);

    statusEl.innerText="STATUS ERROR";

  }

}


document.querySelectorAll("button").forEach(btn=>{

  if(btn.innerText.includes("GENERATE RED")){

    btn.onclick=()=>runGenerate("red");

  }

  if(btn.innerText.includes("GENERATE BLUE")){

    btn.onclick=()=>runGenerate("blue");

  }

});
