module.exports = {
   id: "image-gen",
   name: "Image Generator",
   provider: "replicate",
   model: "owner/model:version",
   creditCost: 10,
   limits: {
      maxDuration: 10
   }
};
