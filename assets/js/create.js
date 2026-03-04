/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: create.js
 * VERSION: v9.2.0
 * STATUS: production
 * LAYER: frontend-controller
 * RESPONSIBILITY:
 * - CTA engine router
 * - build generation payload
 * - call engine modules
 * - update UI status
 * DEPENDS ON:
 * - payload.builder.js
 * - runway.engine.js
 * - upload.service.js
 * - task.poller.js
 * - render-engine.js
 * LAST FIX:
 * - add CTA model mapping system
 * - add engine router v9
 * =====================================================
 */

document.querySelectorAll(".generate-btn").forEach(btn=>{

btn.addEventListener("click",async()=>{

const engineBox=btn.closest(".engine-box");

const model=engineBox.dataset.model;

const mode=engineBox.querySelector(".mode-btn.active-mode");

if(!mode) return;

const alias=mode.dataset.alias;

const prompt=document.getElementById("promptBox").value;

const payload={
model:model,
alias:alias,
prompt:prompt
};

const built=PayloadBuilder.build(payload);

await UploadService.prepare(built);

const task=await RunwayEngine.run(built);

const result=await TaskPoller.wait(task);

RenderEngine.preview(result);

});

});
