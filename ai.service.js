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
// ======================================================
// SN DESIGN ADD ONLY : DEV DEBUG MODE (REAL AI TRACE)
// ======================================================

async function runAI_DEBUG(model,input){

   console.log("========== SN DESIGN AI DEBUG START ==========");
   console.log("MODEL:",model);
   console.log("INPUT:",input);

   try{

      if(!process.env.REPLICATE_API_TOKEN){

         console.log("DEBUG ERROR: TOKEN MISSING");

         throw new Error("TOKEN MISSING");

      }

      console.log("DEBUG: PING REPLICATE...");

      const models = await replicate.models.list();

      console.log("DEBUG: REPLICATE CONNECT OK");

      const output = await replicate.run(model,{ input });

      console.log("DEBUG OUTPUT:",output);

      console.log("========== SN DESIGN AI DEBUG SUCCESS ==========");

      return output;

   }catch(err){

      console.log("========== SN DESIGN AI DEBUG ERROR ==========");
      console.log(err);

      throw err;

   }

}

module.exports.runAI_DEBUG = runAI_DEBUG;

// ======================================================
// SN DESIGN ADD ONLY : AUTO MODEL VERSION FIX
// ======================================================

async function resolveModelVersion(model){

   try{

      console.log("AUTO VERSION CHECK:",model);

      const parts = model.split("/");

      if(parts.length !== 2) return model;

      const owner = parts[0];
      const name = parts[1];

      const modelData = await replicate.models.get(owner,name);

      if(modelData.latest_version){

         const fullModel = `${owner}/${name}:${modelData.latest_version.id}`;

         console.log("AUTO VERSION RESOLVED:",fullModel);

         return fullModel;

      }

      return model;

   }catch(err){

      console.log("AUTO VERSION ERROR:",err);

      return model;

   }

}

// PATCH runAI DEBUG auto resolve

const originalRunAI_DEBUG = module.exports.runAI_DEBUG;

module.exports.runAI_DEBUG = async function(model,input){

   const resolvedModel = await resolveModelVersion(model);

   return originalRunAI_DEBUG(resolvedModel,input);

};
// ======================================================
// SN DESIGN ASYNC RUN ENGINE
// ======================================================

async function runAsyncRender(model,input){

   const jobId = global.SN_CREATE_JOB(input);

   console.log("JOB CREATED:",jobId);

   setTimeout(async()=>{

      try{

         const output = await replicate.run(model,{input});

         global.SN_UPDATE_JOB(jobId,{
            status:"done",
            output
         });

         console.log("JOB DONE:",jobId);

      }catch(err){

         global.SN_UPDATE_JOB(jobId,{
            status:"error",
            error:err.message
         });

      }

   },10);

   return jobId;

}

module.exports.runAsyncRender = runAsyncRender;
