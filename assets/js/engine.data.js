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
endpoint:"/v1/text_to_image",
method:"POST",
model:"gen4_image_turbo",
task_endpoint:"/v1/tasks/{id}"
},

2:{
provider:"runway",
endpoint:"/v1/text_to_image",
method:"POST",
model:"gen4_image",
task_endpoint:"/v1/tasks/{id}"
},

3:{
provider:"runway",
endpoint:"/v1/text_to_video",
method:"POST",
model:"gen4_turbo",
task_endpoint:"/v1/tasks/{id}"
},

4:{
provider:"runway",
endpoint:"/v1/text_to_image",
method:"POST",
model:"gen4_image",
task_endpoint:"/v1/tasks/{id}"
},

5:{
provider:"runway",
endpoint:"/v1/text_to_image",
method:"POST",
model:"gen4_image_turbo",
task_endpoint:"/v1/tasks/{id}"
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
provider:"google",
endpoint:"/v1/video_generate",
method:"POST",
model:"veo3"
},

9:{
provider:"google",
endpoint:"/v1/video_generate",
method:"POST",
model:"veo3.1"
},

10:{
provider:"google",
endpoint:"/v1/video_generate",
method:"POST",
model:"veo3.1_fast"
},

11:{
provider:"google",
endpoint:"/v1/image_generate",
method:"POST",
model:"gemini_2.5_flash"
},

12:{
provider:"elevenlabs",
endpoint:"/v1/text_to_speech",
method:"POST",
model:"eleven_multilingual_v2"
},

13:{
provider:"elevenlabs",
endpoint:"/v1/text_to_sound",
method:"POST",
model:"eleven_text_to_sound_v2"
},

14:{
provider:"elevenlabs",
endpoint:"/v1/speech_to_speech",
method:"POST",
model:"eleven_multilingual_sts_v2"
}

  }
