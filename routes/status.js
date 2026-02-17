const express = require("express");
const router = express.Router();

const projectService = require("../services/projectService");

router.get("/", async(req,res)=>{

   const id = req.query.id;

   const data = await projectService.getProject(id);

   if(!data){

      return res.status(404).json({error:"not found"});

   }

   res.json(data);

});

module.exports = router;
