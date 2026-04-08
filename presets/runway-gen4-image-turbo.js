module.exports = {
   id: "runway-gen4-image-turbo",
   name: "Runway Gen-4 Image Turbo",
   provider: "runwayml",
   model: "gen4-image-turbo",
   creditCost: 15,
   type: "image",
   inputs:{
      prompt:true,
      image:false
   },
   limits:{
      maxDuration:10
   }
};
