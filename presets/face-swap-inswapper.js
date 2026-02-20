module.exports = {
  id:"face-inswapper",
  name:"Face Swap (InSwapper)",
  provider:"replicate",
  model:"cjwbw/inswapper",
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
