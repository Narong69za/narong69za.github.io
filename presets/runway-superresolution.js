module.exports = {
  id:"runway-superres",
  name:"Runway Super Resolution",
  provider:"runway",
  model:"super-resolution-v1",  // runway internal slug
  creditCost: 8,
  ui:{
    needImage:true,
    needPrompt:false,
    needVideo:false
  },
  inputs:{
    image:""
  }
};
