/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: payload.builder.js
VERSION: v9.2.0
STATUS: production-final
RESPONSIBILITY:
- build payload from CTA_MODEL_MASTER
- normalize fields for providers
===================================================== */

import { CTA_MODEL_MASTER } from "./cta.model.master.js"

export function buildPayload(cta,data){

const cfg = CTA_MODEL_MASTER[cta]

let payload = {}

payload.model = cfg.model

/* RUNWAY */

if(data.prompt) payload.promptText = data.prompt
if(data.image) payload.promptImage = data.image
if(data.video) payload.videoUri = data.video

/* UNIVERSAL */

if(data.duration) payload.duration = data.duration
if(data.ratio) payload.ratio = data.ratio

/* REPLICATE */

if(cfg.engine === "replicate"){
payload.input = {
prompt:data.prompt
}
}

/* GEMINI */

if(cfg.engine === "gemini"){
payload.contents = [
{
parts:[
{ text:data.prompt }
]
}
]
}

/* ELEVENLABS */

if(cfg.engine === "elevenlabs"){
payload.text = data.prompt
if(data.audio) payload.audio = data.audio
}

return payload

}
