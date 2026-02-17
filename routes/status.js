const router = require("express").Router();
const project = require("../services/projectService");

router.get("/", async (req,res)=>{

   const data = await project.get(req.query.id);

   res.json(data || { status:"not_found" });

});

module.exports = router;
