const express=require("express");
const router=express.Router();

const paymentStatus=require("../controllers/payment-status.controller");

router.get("/status",paymentStatus.checkStatus);

module.exports=router;
