module.exports = {

  "dark-viral": {
     provider: "replicate",
     model: "black-forest-labs/flux-2-pro",
     maxDuration: 30,
     creditCost: 3.5,
     description: "Cinematic viral style"
  },

  "cinematic-pro": {
     provider: "runway",
     model: "gen-3",
     maxDuration: 30
  },

  "face-clone": {
     provider: "replicate",
     model: "face-swap-model"
  },

  "dance-motion": {
     provider: "runway",
     model: "motion-control"
  },

  "hyper-real": {
     provider: "replicate",
     model: "realistic-engine"
  }

};
