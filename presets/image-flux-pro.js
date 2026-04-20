module.exports = {
  id:"image-flux-pro",
  name:"Flux Pro Image Gen",
  provider:"replicate",
  model:"black-forest-labs/flux-pro",
  creditCost: 10,
  ui:{
    needPrompt:true,
    needImage:false,
    needVideo:false
  },
  inputs:{
    prompt:""
  }
};
