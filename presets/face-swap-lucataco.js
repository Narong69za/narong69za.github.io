module.exports = {
  id:"face-swap-lucataco",
  name:"Face Swap (Lucataco)",
  provider:"replicate",
  model:"lucataco/faceswap",
  creditCost: 20,
  ui:{
    needImage:true,
    needPrompt:false,
    needVideo:false
  },
  inputs:{
    source:"image",
    target:"image"
  }
};
