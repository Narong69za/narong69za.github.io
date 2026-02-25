// models/model.router.js

exports.run = async (data)=>{

   const { engine, alias } = data;

   if(engine === "runwayml"){

      if(alias === "image_to_video"){

         const service = require("../services/runwayml/v1/image_to_video");

         return await service.run(data);

      }

      throw new Error("RUNWAY MODEL NOT FOUND");

   }

   throw new Error("ENGINE NOT FOUND");

};
