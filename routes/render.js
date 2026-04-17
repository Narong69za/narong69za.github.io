const express = require("express");
const router = express.Router();
const db = require("../db/db");
const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

router.post("/", async (req,res)=>{

   const { engine, prompt } = req.body;

   const id = Date.now().toString();

   db.run(
      `INSERT INTO projects(id,engine,prompt,status,progress)
       VALUES(?,?,?,?,?)`,
      [id,engine,prompt,"queued",0]
   );

   processRender(id,engine,prompt);

   res.json({ id });
});

async function processRender(id,engine,prompt){

   update(id,"running",10);

   let model;

   if(engine === "flux"){
      model="black-forest-labs/flux-2-pro";
   }

   if(engine === "imagen"){
      model="google/imagen-4";
   }

   const output = await replicate.run(model,{
      input:{ prompt }
   });

   db.run(
      `UPDATE projects SET status=?,progress=?,result=? WHERE id=?`,
      ["done",100,JSON.stringify(output),id]
   );
}

function update(id,status,progress){
   db.run(
      `UPDATE projects SET status=?,progress=? WHERE id=?`,
      [status,progress,id]
   );
}

module.exports = router;
