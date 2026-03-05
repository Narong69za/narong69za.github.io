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
alias:"image_to_video",
engine:"runway",
endpoint:"/v1/image_to_video",
model:"gen4.5"
},

2:{
cta:"CTA_02",
alias:"text_to_video",
engine:"runway",
endpoint:"/v1/text_to_video",
model:"gen4.5"
},

3:{
cta:"CTA_03",
alias:"video_transform",
engine:"runway",
endpoint:"/v1/video_to_video",
model:"gen4_aleph"
},

4:{
cta:"CTA_04",
alias:"text_to_image",
engine:"replicate",
model:"black-forest-labs/flux-1.1-pro"
},

5:{
cta:"CTA_05",
alias:"fast_image",
engine:"replicate",
model:"black-forest-labs/flux-schnell"
},

6:{
cta:"CTA_06",
alias:"redux_image",
engine:"replicate",
model:"black-forest-labs/flux-redux"
},

7:{
cta:"CTA_07",
alias:"character_motion",
engine:"runway",
endpoint:"/v1/character_performance",
model:"act_two"
},

8:{
cta:"CTA_08",
alias:"video_enhance",
engine:"runway",
endpoint:"/v1/video_to_video",
model:"gen4_aleph"
},

9:{
cta:"CTA_09",
alias:"video_ai",
engine:"runway",
endpoint:"/v1/text_to_video",
model:"veo3"
},

10:{
cta:"CTA_10",
alias:"video_fast",
engine:"runway",
endpoint:"/v1/text_to_video",
model:"veo3.1_fast"
},

11:{
cta:"CTA_11",
alias:"gemini_image",
engine:"gemini",
model:"gemini-2.5-flash"
},

12:{
cta:"CTA_12",
alias:"voice_ai",
engine:"elevenlabs",
model:"multilingual_v2"
},

13:{
cta:"CTA_13",
alias:"sound_fx",
engine:"elevenlabs",
model:"text_to_sound_v2"
},

14:{
cta:"CTA_14",
alias:"voice_transfer",
engine:"elevenlabs",
model:"sts_v2"
}

}
