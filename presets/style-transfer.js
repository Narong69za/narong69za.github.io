module.exports = {
  id:"style-transfer",
  name:"Style Transfer",
  provider:"replicate",
  model:"deep-ai/style-transfer",
  creditCost: 8,
  ui:{
    needImage:true,
    needPrompt:true
  },
  inputs:{
    image:""
  }
};
