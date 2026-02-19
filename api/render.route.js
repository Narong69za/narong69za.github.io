const express = require("express");
const router = express.Router();

const engine = require("../services");


router.post("/", async(req,res)=>{

   try{

      const result = await engine.runEngine(req.body);

      res.json(result);

   }catch(err){

      console.log(err);

      res.status(500).json({error:true});

   }

});

module.exports = router;
