/*
====================================
SN DESIGN — ULTRA PRESET MAP
MASTER ENGINE CONFIG
====================================
*/

module.exports = {

  "dark-viral": {

    provider : "replicate",

    engine : "image-gen",

    model : {
      id : "black-forest-labs/flux-2-pro",
      version : "latest"
    },

    limits : {
      maxDuration : 30
    },

    creditCost : 3.5,

    input : {
      prompt : true,
      image : false,
      video : false
    },

    description : "Cinematic viral style preset"

  },


  "cinematic-pro": {

    provider : "runway",

    engine : "video-gen",

    model : {
      id : "gen-3",
      version : "latest"
    },

    limits : {
      maxDuration : 30
    },

    creditCost : 4,

    input : {
      prompt : true,
      image : true,
      video : false
    }

  },


  "face-clone": {

    provider : "replicate",

    engine : "face-clone",

    model : {
      id : "face-swap-model",
      version : "latest"
    },

    input : {
      prompt : false,
      image : true,
      video : true
    }

  },


  "dance-motion": {

    provider : "runway",

    engine : "motion-control",

    model : {
      id : "motion-control",
      version : "latest"
    },

    input : {
      prompt : true,
      video : true
    }

  },


  "hyper-real": {

    provider : "replicate",

    engine : "image-realism",

    model : {
      id : "realistic-engine",
      version : "latest"
    },

    input : {
      prompt : true
    }

  }

};
