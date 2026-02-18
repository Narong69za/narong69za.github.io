const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.post("/render",(req,res)=>{

   const { engine, prompt } = req.body;

   const id = Date.now().toString();

   db.run(
      "INSERT INTO projects (id,engine,prompt,status) VALUES (?,?,?,?)",
      [id,engine,prompt,"queued"],
      (err)=>{

         if(err){
            return res.status(500).json({error:err.message});
         }

         res.json({
            status:"queued",
            id:id
         });

      }
   );

});

module.exports = router;
