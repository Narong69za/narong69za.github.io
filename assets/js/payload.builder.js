/* =====================================================
FILE: /assets/js/payload.builder.js
===================================================== */

import {CTA_MODEL_MASTER} from "./cta.model.master.js"

export function buildPayload(cta,data){

const cfg = CTA_MODEL_MASTER[cta]

let payload={}

payload.model = cfg.model

if(data.prompt) payload.promptText=data.prompt
if(data.image) payload.promptImage=data.image
if(data.video) payload.videoUri=data.video
if(data.duration) payload.duration=data.duration
if(data.ratio) payload.ratio=data.ratio

return payload

}
