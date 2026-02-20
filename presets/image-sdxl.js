module.exports = {
  id:"image-sdxl",
  name:"Stable Diffusion XL",
  provider:"replicate",
  model:"stability-ai/sdxl",
  creditCost: 12,
  ui:{
    needPrompt:true,
    needImage:false,
    needVideo:false
  },
  inputs:{
    prompt:""
  }
};
