// =============================
// SN DESIGN AI SERVICE
// ULTRA LOCK VERSION
// =============================

const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});


// =============================
// AI HEARTBEAT STATUS (ADD ONLY)
// =============================

let AI_STATUS = false;


// =============================
// TEST CONNECTION
// =============================

async function generate() {

  try{

    if(!process.env.REPLICATE_API_TOKEN){
      AI_STATUS = false;
      return "AI TOKEN MISSING";
    }

    AI_STATUS = true;
    return "AI CONNECT READY";

  }catch(e){

    AI_STATUS = false;
    return "AI ERROR";

  }

}


// =============================
// RUN AI MODEL
// =============================

async function runAI(model, input) {

  try {

    const output = await replicate.run(
      model,
      {
        input: input
      }
    );

    AI_STATUS = true;

    return output;

  } catch (err) {

    AI_STATUS = false;

    console.error("AI ERROR:", err);

    throw new Error("AI PROCESS FAILED");

  }

}


// =============================
// STATUS EXPORT (ADD ONLY)
// =============================

function getAIStatus(){
  return AI_STATUS;
}


module.exports = {
  generate,
  runAI,
  getAIStatus
};
