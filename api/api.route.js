const express=require("express");
const router=express.Router();

const { runAI } = require("../services/ai.service");
const { verifyGoogle } = require("../services/auth.service");

const usageStore={};

/* AUTH CHECK */

router.post("/auth-check",async(req,res)=>{

try{

const {token}=req.body;

const user=await verifyGoogle(token);

const key=user.email;

if(!usageStore[key]) usageStore[key]=0;

usageStore[key]++;

if(user.dev!==true && usageStore[key]>3){

return res.json({limit:true});

}

res.json({

ok:true,
user:user,
remaining:3-usageStore[key]

});

}catch(e){

res.status(401).json({error:"AUTH FAILED"});

}

});


/* RENDER */

router.post("/render",async(req,res)=>{

const {template,input}=req.body;

const modelMap={

"dark-viral":"owner/model1",
"ai-lipsync":"owner/model2",
"dance-motion":"owner/model3",
"face-swap":"owner/model4"

};

const model=modelMap[template];

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
