const router = require("express").Router();
const queue = require("../services/queueService");

router.post("/", async (req,res)=>{

   try{

      const job = await queue.addJob(req.body);

      res.json({ jobID: job.id });

   }catch(e){

      res.status(500).json({ error:e.message });

   }

});

module.exports = router;
