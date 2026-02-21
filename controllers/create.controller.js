const MODEL_ROUTER = require("../services/model.router");

async function create(req,res){

   try{

      const result = await MODEL_ROUTER.runModel(req.body);

      res.json({
         success:true,
         result
      });

   }catch(err){

      console.log(err);

      res.status(500).json({
         error: err.message
      });

   }

}

module.exports = { create };
