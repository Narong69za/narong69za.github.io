const replicate = require("../services/replicate/replicate.service");
const runway = require("../services/runway/runway.service");

exports.run = async ({engine,alias,type,prompt,files})=>{

   if(engine==="replicate"){

      return replicate.run({alias,type,prompt,files});

   }

   if(engine==="runway"){

      return runway.run({alias,type,prompt,files});

   }

   throw new Error("ENGINE NOT FOUND");

};
