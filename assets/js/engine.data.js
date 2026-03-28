/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: engine.data.js
VERSION: v9.2.0
STATUS: production-final
RESPONSIBILITY:
- engine → provider mapping
- endpoint mapping
===================================================== */

export const ENGINE_DATA = {

1:{
provider:"runway",
endpoint:"/v1/image_to_video",
method:"POST",
model:"gen4.5",
task_endpoint:"/v1/tasks/{id}"
},

2:{
provider:"runway",
endpoint:"/v1/text_to_video",
method:"POST",
model:"gen4.5",
task_endpoint:"/v1/tasks/{id}"
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
model:"black-forest-labs/flux-1.1-pro"
},

5:{
provider:"replicate",
endpoint:"/v1/predictions",
method:"POST",
model:"black-forest-labs/flux-schnell"
},

6:{
provider:"replicate",
endpoint:"/v1/predictions",
method:"POST",
model:"black-forest-labs/flux-redux"
},

7:{
provider:"runway",
endpoint:"/v1/character_performance",
method:"POST",
model:"act_two",
task_endpoint:"/v1/tasks/{id}"
},

8:{
provider:"runway",
endpoint:"/v1/video_to_video",
method:"POST",
model:"gen4_aleph",
task_endpoint:"/v1/tasks/{id}"
},

9:{
provider:"runway",
endpoint:"/v1/text_to_video",
method:"POST",
model:"gen4_turbo",
task_endpoint:"/v1/tasks/{id}"
},

10:{
provider:"runway",
endpoint:"/v1/text_to_video",
method:"POST",
model:"gen4_turbo",
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
