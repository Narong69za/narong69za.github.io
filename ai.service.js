// =============================
// SN DESIGN AI SERVICE
// ULTRA REAL STATUS ENGINE
// =============================

const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

let AI_STATUS = false;


// =============================
// HEARTBEAT CHECK (REAL)
// =============================

async function generate(){

  try{

    if(!process.env.REPLICATE_API_TOKEN){

      AI_STATUS = false;
      return "AI TOKEN MISSING";

    }

    // ping replicate (real check)
    await replicate.models.list();

    AI_STATUS = true;

    return "AI CONNECT READY";

  }catch(err){

    console.log("AI HEARTBEAT FAIL:",err);

    AI_STATUS = false;

    return "AI OFFLINE";

  }

}


// =============================
// RUN MODEL
// =============================

async function runAI(model,input){

  try{

    const output = await replicate.run(model,{ input });

    AI_STATUS = true;

    return output;

  }catch(err){

    AI_STATUS = false;

    console.error("AI ERROR:",err);

    throw new Error("AI PROCESS FAILED");

  }

}


// =============================
// EXPORT STATUS
// =============================

function getAIStatus(){
  return AI_STATUS;
}


module.exports = {
  generate,
  runAI,
  getAIStatus
};
