/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: engine.data.js
VERSION: v9.0.0
STATUS: production
RESPONSIBILITY:
- store engine → model → endpoint mapping
- define payload schema
- define response schema
- used by payload.builder and router
===================================================== */

export const ENGINE_DATA = {

1:{

engine:"runway",

provider:"runwayml",

endpoint:"/v1/text_to_image",

method:"POST",

headers:{
"X-Runway-Version":"2024-11-06"
},

model:"gen4_image_turbo",

payload:{

prompt:"promptText",

seed:"seed",

ratio:"ratio",

referenceImages:"referenceImages",

contentModeration:"contentModeration",

model:"model"

},

response:{

task_id:"id"

},

task:{

endpoint:"/v1/tasks/{id}",
method:"GET"
}

}

}
