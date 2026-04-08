const express=require("express");
const router=express.Router();

const scbController=require("../controllers/scb.controller");

router.post("/create-qr",scbController.createQR);

module.exports=router;
