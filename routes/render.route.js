const express = require("express");
const router = express.Router();

const MODEL_ROUTER = require("../services/model.router");

router.post("/render", async (req,res)=>{

   try{

      const { platform, mode, prompt } = req.body;

      const result = await MODEL_ROUTER.run(
         mode,
         platform,
         { prompt }
      );

      res.json({
         success:true,
         result
      });

   }catch(err){

      console.log(err);

      res.status(500).json({
         success:false,
         error:err.message
      });

   }

});

module.exports = router;
