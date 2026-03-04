/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: CTA MODEL MASTER
FILE: /assets/js/cta.model.master.js
VERSION: v9.0
STATUS: production
===================================================== */

export const CTA_MODEL_MASTER = {

1:{
cta:"CTA_01",
alias:"video_from_image",
engine:"runway",
endpoint:"/v1/image_to_video",
model:"gen4.5",
upload:["image"],
duration:[2,10],
ratio:["1280:720","720:1280","960:960"],
credit_base:12,
credit_per_sec:2
},

2:{
cta:"CTA_02",
alias:"text_to_video",
engine:"runway",
endpoint:"/v1/text_to_video",
model:"gen4.5",
upload:[],
duration:[2,10],
ratio:["1280:720","720:1280"],
credit_base:10,
credit_per_sec:2
},

3:{
cta:"CTA_03",
alias:"video_transform",
engine:"runway",
endpoint:"/v1/video_to_video",
model:"gen4_aleph",
upload:["video"],
duration:"source",
ratio:"source",
credit_base:14
},

4:{
cta:"CTA_04",
alias:"text_to_image",
engine:"runway",
endpoint:"/v1/text_to_image",
model:"gen4_image_turbo",
upload:["reference_optional"],
ratio:["1024:1024","1920:1080"],
credit_base:5
},

5:{
cta:"CTA_05",
alias:"character_motion",
engine:"runway",
endpoint:"/v1/character_performance",
model:"act_two",
upload:["character_image","reference_video"],
duration:[3,30],
ratio:["1280:720","960:960"],
credit_base:18
},

6:{
cta:"CTA_06",
alias:"sound_generate",
engine:"runway",
endpoint:"/v1/sound_effect",
model:"eleven_text_to_sound_v2",
duration:[0.5,22],
credit_base:3
},

7:{
cta:"CTA_07",
alias:"speech_to_speech",
engine:"runway",
endpoint:"/v1/speech_to_speech",
model:"eleven_multilingual_sts_v2",
upload:["audio"],
credit_base:4
},

8:{cta:"CTA_08",engine:"replicate"},
9:{cta:"CTA_09",engine:"replicate"},
10:{cta:"CTA_10",engine:"pika"},
11:{cta:"CTA_11",engine:"pika"},
12:{cta:"CTA_12",engine:"leonardo"},
13:{cta:"CTA_13",engine:"leonardo"},
14:{cta:"CTA_14",engine:"system"}

  }
