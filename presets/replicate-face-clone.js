module.exports = {
   id:"replicate-face-clone",
   name:"Replicate Face Clone",
   provider:"replicate",
   model:"lucataco/face-swap",
   creditCost:15,
   type:"image",
   inputs:{
      source:true,
      target:true
   },
   limits:{
      maxDuration:10
   }
};
