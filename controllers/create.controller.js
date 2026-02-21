/*
=====================================
CREATE CONTROLLER
SN DESIGN STUDIO
=====================================
*/

const modelRouter = require("../services/model.router");

async function create(req,res){

   try{

      const result = await modelRouter.runModel(req.body);

      res.json({
         success:true,
         result
      });

   }catch(err){

      console.error("CREATE ERROR:", err);

      res.status(500).json({
         success:false,
         error:err.message
      });

   }

}

module.exports = { create };
