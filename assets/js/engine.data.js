/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: engine.data.js
VERSION: v9.1.0
STATUS: production
RESPONSIBILITY:
- store engine → model → endpoint mapping
- used by payload.builder
- used by router
===================================================== */

export const ENGINE_DATA = {

1:{
provider:"runway",
endpoint:"/v1/text_to_video",
method:"POST",
model:"gen4.5",
task_endpoint:"/v1/tasks/{id}"
},

2:{
provider:"replicate",
endpoint:"/v1/predictions",
method:"POST",
model:"black-forest-labs/flux-1.1-pro"
},

3:{
provider:"runway",
endpoint:"/v1/video_to_video",
method:"POST",
model:"gen4_aleph",
task_endpoint:"/v1/tasks/{id}"
},

4:{
provider:"replicate",
endpoint:"/v1/predictions",
method:"POST",
model:"black-forest-labs/flux-schnell"
},

5:{
provider:"replicate",
endpoint:"/v1/predictions",
method:"POST",
model:"black-forest-labs/flux-redux"
},

6:{
provider:"runway",
endpoint:"/v1/character_performance",
method:"POST",
model:"act_two",
task_endpoint:"/v1/tasks/{id}"
},

7:{
provider:"runway",
endpoint:"/v1/video_to_video",
method:"POST",
model:"gen4_aleph",
task_endpoint:"/v1/tasks/{id}"
},

8:{
provider:"runway",
endpoint:"/v1/text_to_video",
method:"POST",
model:"veo3",
task_endpoint:"/v1/tasks/{id}"
},

9:{
provider:"runway",
endpoint:"/v1/text_to_video",
method:"POST",
model:"veo3.1",
task_endpoint:"/v1/tasks/{id}"
},

10:{
provider:"runway",
endpoint:"/v1/text_to_video",
method:"POST",
model:"veo3.1_fast",
task_endpoint:"/v1/tasks/{id}"
},

11:{
provider:"gemini",
endpoint:"/v1beta/models/gemini-2.5-flash:generateContent",
method:"POST",
model:"gemini-2.5-flash"
},

12:{
provider:"elevenlabs",
endpoint:"/v1/text-to-speech",
method:"POST",
model:"multilingual_v2"
},

13:{
provider:"elevenlabs",
endpoint:"/v1/sound-generation",
method:"POST",
model:"text_to_sound_v2"
},

14:{
provider:"elevenlabs",
endpoint:"/v1/speech-to-speech",
method:"POST",
model:"sts_v2"
}

}
