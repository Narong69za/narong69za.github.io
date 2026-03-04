/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: model.schema.js
VERSION: v9.0.0
STATUS: production
LAYER: MODEL SPECIFICATION

CREATED: 2026
AUTHOR: SN DESIGN ENGINE SYSTEM

RESPONSIBILITY:
- define full model specification
- validate prompt length
- validate upload type
- validate file size
- expose schema for UI + payload builder

USED BY:
- create.js
- payload.builder.js
- credit.calculator.js
- endpoint.router.js

DEPENDS ON:
- cta.model.master.js

DESCRIPTION:
Central schema registry for all AI models used by
SN DESIGN MULTI ENGINE PLATFORM.

Each model contains:
- prompt limit
- file input rules
- supported ratio
- supported duration
- file size limits
- media format rules

This ensures UI and backend remain synchronized
with platform requirements.

===================================================== */

export const MODEL_SCHEMA = {

gen4_turbo:{

type:"video",

prompt_max:1000,

input:{
image:false,
video:false,
audio:false
},

ratio:[
"1280:720",
"720:1280",
"960:960"
],

duration:[
2,4,6,8,10
],

file_types:[],

max_file_size:null

},

gen4_image:{

type:"image",

prompt_max:1000,

input:{
image:false
},

ratio:[
"1024:1024",
"1920:1080",
"1080:1920"
],

file_types:[],

max_file_size:null

},

gen4_image_turbo:{

type:"image",

prompt_max:1000,

input:{
reference_image:true
},

ratio:[
"1024:1024",
"1920:1080"
],

file_types:[
"jpg",
"jpeg",
"png"
],

max_file_size:"10MB"

},

gen4_aleph:{

type:"video",

prompt_max:800,

input:{
video:true
},

ratio:"source",

duration:"source",

file_types:[
"mp4",
"mov"
],

max_file_size:"200MB"

},

act_two:{

type:"video",

prompt_max:800,

input:{
character_image:true,
reference_video:true
},

ratio:[
"1280:720",
"960:960"
],

duration:[
3,5,10,20,30
],

file_types:[
"png",
"jpg",
"mp4"
],

max_file_size:"200MB"

},

gemini_2_5_flash:{

type:"image",

prompt_max:2000,

input:{
image:false
},

ratio:[
"1024:1024"
]

},

eleven_multilingual_v2:{

type:"audio",

prompt_max:2000,

audio_format:[
"mp3",
"wav"
]

},

eleven_text_to_sound_v2:{

type:"audio",

prompt_max:2000,

duration:[
0.5,1,2,5,10,20
]

},

eleven_multilingual_sts_v2:{

type:"audio",

prompt_max:2000,

input:{
audio:true
},

audio_format:[
"mp3",
"wav"
]

}

}

export function getModelSchema(model){

return MODEL_SCHEMA[model] || null

  }
