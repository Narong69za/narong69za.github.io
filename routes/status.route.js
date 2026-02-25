const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/status/:jobId", async (req, res) => {

   const job = await db.jobs.findByPk(req.params.jobId);

   if (!job)
      return res.status(404).json({ error: "JOB NOT FOUND" });

   res.json({
      status: job.status,
      output: job.output_url || null
   });

});

module.exports = router;
