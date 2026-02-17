const express=require("express");
const router=express.Router();

const projectService=require("../services/projectService");

router.post("/",async(req,res)=>{

   const body=req.body;

   await projectService.updateResult(
      body.externalJobID,
      body
   );

   res.json({ok:true});

});

module.exports=router;
