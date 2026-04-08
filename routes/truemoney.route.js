const express=require('express'); const router=express.Router(); const tm=require('../controllers/truemoney.controller'); router.post('/pay', tm.processGiftLink); module.exports=router;
