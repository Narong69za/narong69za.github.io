/*
================================
ULTRA AUTO MODEL ROUTER
SN DESIGN STUDIO
================================
*/

const MODEL_ROUTER = {

   /* ================= REPLICATE ================= */

   "image-gen": {
      provider:"replicate",
      model:"stability-ai/sdxl"
   },

   "face-clone": {
      provider:"replicate",
      model:"lucataco/face-swap"
   },

   "motion-control": {
      provider:"replicate",
      model:"cjwbw/animate-anything"
   },

   /* ================= RUNWAY ================= */

   "gen4-video": {
      provider:"runway",
      model:"gen4_image_to_video"
   }

};

module.exports = MODEL_ROUTER;
