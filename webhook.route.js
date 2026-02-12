const express = require('express');
const router = express.Router();

router.post('/', (req,res)=>{
  console.log("WEBHOOK RECEIVED");
  res.sendStatus(200);
});

module.exports = router;
