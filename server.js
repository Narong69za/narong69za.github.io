require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const MODEL_ROUTER = require("./services/model.router");
const runwayPoller = require("./services/runwayml/v1/runway.poller");
const authMiddleware = require("./middleware/auth");
const paymentWebhook = require("./routes/payment.webhook");
const db = require("./db/db");

const app = express();

app.use(cors({
  origin: [
    "https://sn-designstudio.dev"
  ],
  credentials: true
}));
app.use(bodyParser.json());

app.use(paymentWebhook);

app.post("/api/create", authMiddleware, async (req,res)=>{

  try{

    if(req.user.id !== 1){ // dev bypass id=1
      await db.deductCredit(req.user.id,1);
    }

    const result = await MODEL_ROUTER.run({
      engine:req.body.engine,
      mode:req.body.mode,
      prompt:req.body.prompt,
      files:{
        fileAUrl:req.body.fileAUrl,
        fileBUrl:req.body.fileBUrl
      }
    });

    res.json({success:true,data:result});

  }catch(err){
    res.status(500).json({error:err.message});
  }

});

app.get("/api/me", authMiddleware, async (req,res)=>{
  res.json(req.user);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
  console.log("SERVER RUNNING:",PORT);
  runwayPoller.start();
});
