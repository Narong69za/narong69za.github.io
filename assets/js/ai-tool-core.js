const buttons = document.querySelectorAll(".tool-btn");

buttons.forEach(btn=>{

btn.addEventListener("click",()=>{

document.querySelectorAll(".ai-panel").forEach(p=>{

p.style.display="none";

});

document.querySelectorAll(".tool-btn").forEach(b=>{

b.classList.remove("active");

});

btn.classList.add("active");

const tool = btn.dataset.tool;

document.getElementById("panel-"+tool).style.display="block";

});

});
