const express=require("express");
const router=express.Router();

const { runAI } = require("../services/ai.service");
const { verifyGoogle } = require("../services/auth.service");
const { checkUsage } = require("../services/credit.service");
const { getModel } = require("../models/model.router");


router.post("/auth-check",async(req,res)=>{

const {token}=req.body;

const user=await verifyGoogle(token);

const usage=checkUsage(user);

if(!usage.allow){

return res.json({limit:true});

}

res.json({

ok:true,
user:user

});

});


router.post("/render",async(req,res)=>{

const {template,input}=req.body;

const model=getModel(template);

if(!model){

return res.status(400).json({error:"INVALID TEMPLATE"});

}

const output=await runAI(model,input);

res.json({

success:true,
jobId:"demo123",
output

});

});

module.exports=router;
