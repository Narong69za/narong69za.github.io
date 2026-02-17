const express = require("express");
const router = express.Router();

const projectService = require("../services/projectService");

router.post("/", async(req,res)=>{

   try{

      const id = await projectService.createProject(req.body);

      res.json({
         success:true,
         jobID:id
      });

   }catch(e){

      res.status(500).json({error:e.message});

   }

});

module.exports = router;
