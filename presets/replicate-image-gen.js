module.exports = {
   id:"replicate-image-gen",
   name:"Replicate Image Generator",
   provider:"replicate",
   model:"black-forest-labs/flux-1.1-pro",
   creditCost:10,
   type:"image",
   inputs:{
      prompt:true
   },
   limits:{
      maxDuration:10
   }
};
