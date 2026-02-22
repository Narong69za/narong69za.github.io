const express = require("express");
const router = express.Router();
const MODEL_ROUTER = require("../services/model.router");

router.post("/render", async (req,res)=>{

   try{

      const { engine, alias, prompt } = req.body;

      const result = await MODEL_ROUTER.run(
         alias,
         engine,
         {
            prompt
         }
      );

      res.json({
         status:"complete",
         result
      });

   }catch(err){

      console.log(err);

      res.status(500).json({
         status:"error",
         error:err.message
      });

   }

});

module.exports = router;
