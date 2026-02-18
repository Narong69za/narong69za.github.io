const express = require("express");
const router = express.Router();

router.post("/render",(req,res)=>{

   const { engine, prompt } = req.body;

   console.log(engine,prompt);

   res.json({
      status:"ok",
      engine,
      prompt
   });

});

module.exports = router;
