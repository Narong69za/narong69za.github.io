module.exports = {
   id:"runway-gen3-alpha-turbo",
   name:"Runway Gen-3 Alpha Turbo",
   provider:"runwayml",
   model:"gen3-alpha-turbo",
   creditCost:20,
   type:"video",
   inputs:{
      prompt:true,
      image:true
   },
   limits:{
      maxDuration:10
   }
};
