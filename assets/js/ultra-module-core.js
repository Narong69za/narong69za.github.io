/* ===============================
ULTRA MODULE CORE SYSTEM
FINAL
================================ */

document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const template = params.get("template");

  if(!template) return;

  loadModule(template);

});

function loadModule(name){

  const script = document.createElement("script");

  script.src = `assets/js/modules/${name}.js`;

  script.onload = () => {

    if(window.ultraModuleInit){

      window.ultraModuleInit();

    }

  };

  document.body.appendChild(script);

}
