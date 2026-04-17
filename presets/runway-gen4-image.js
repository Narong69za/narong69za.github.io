module.exports = {
   id: "runway-gen4-image",
   name: "Runway Gen-4 Image",
   provider: "runwayml",
   model: "gen4-image",
   creditCost: 10,
   type: "image",
   inputs: {
      prompt: true,
      image: false
   },
   limits:{
      maxDuration: 10
   }
};
