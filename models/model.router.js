const replicate = require("../services/replicate/replicate.service.js");
const runway = require("../services/runway/gen4video.js");

exports.run = async (payload)=>{

   const {engine} = payload;

   if(engine === "replicate"){
      return await replicate.run(payload);
   }

   if(engine === "runway"){
      return await runway.run(payload);
   }

   throw new Error("ENGINE NOT SUPPORTED");

};
