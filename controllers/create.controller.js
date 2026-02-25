// controllers/create.controller.js

const modelRouter = require("../models/model.router");
const db = require("../db/db");

const COST_TABLE = {
  video: 5,
  lipsync: 4,
  motion_transfer: 4,
  face_swap: 3
};

exports.create = async (req,res)=>{

  try{

    const { engine, alias, type, prompt } = req.body;

    const files = {};

    if(req.files){
      req.files.forEach(f=>{
        files[f.fieldname] = f;
      });
    }

    const cost = COST_TABLE[type] || 5;

    await db.decreaseCredit(req.user.id, cost);

    const result = await modelRouter.run({
      engine,
      alias,
      type,
      prompt,
      files
    });

    res.json({
      status:"queued",
      remainingCredit: req.user.credits - cost,
      result
    });

  }catch(err){

    console.error(err);

    res.status(500).json({
      error:err.message
    });

  }

};
