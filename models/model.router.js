/*
=====================================
ULTRA MODEL MAP
SN DESIGN STUDIO FINAL
=====================================
*/

const MODEL_MAP = {

   // REPLICATE
   "replicate-face-clone": {
      provider:"replicate",
      model:"owner/face-clone-model"
   },

   "replicate-image-gen": {
      provider:"replicate",
      model:"owner/image-gen-model"
   },

   // RUNWAY
   "runway-act-two":{
      provider:"runwayml",
      model:"act-two"
   },

   "runway-gen3-alpha-turbo":{
      provider:"runwayml",
      model:"gen3-alpha-turbo"
   },

   "runway-gen4-image":{
      provider:"runwayml",
      model:"gen4-image"
   },

   "runway-gen4-image-turbo":{
      provider:"runwayml",
      model:"gen4-image-turbo"
   },

   "runway-upscale-v1":{
      provider:"runwayml",
      model:"upscale-v1"
   },

   "runway-superresolution":{
      provider:"runwayml",
      model:"superresolution"
   },

   // OTHER
   "motion-control":{
      provider:"runwayml",
      model:"motion-control"
   },

   "lipsync":{
      provider:"replicate",
      model:"lipsync-model"
   },

   "dance-motion":{
      provider:"runwayml",
      model:"dance-motion"
   },

   "style-transfer":{
      provider:"replicate",
      model:"style-transfer"
   }

};

module.exports = MODEL_MAP;
