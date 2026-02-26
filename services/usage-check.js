// =====================================================
// SN DESIGN ENGINE AI
// FREE USAGE CHECK (EXPRESS VERSION)
// =====================================================

module.exports = async function usageCheck(req,res,next){

try{

// ======================
// GET CLIENT IP
// ======================

const ip =
req.headers["x-forwarded-for"]?.split(",")[0] ||
req.socket.remoteAddress;


// ======================
// DEV BYPASS
// ======================

if(process.env.DEV_MODE === "true"){

   console.log("DEV BYPASS FREE LIMIT");

   return next();

}


// ======================
// USAGE LIMIT ENGINE
// ======================

const today = new Date().toISOString().slice(0,10);

global.usageStore = global.usageStore || {};

const key = ip + "_" + today;

if(!global.usageStore[key]){

   global.usageStore[key] = 0;

}

if(global.usageStore[key] >= 3){

   return res.status(403).json({
      limit:true,
      message:"FREE LIMIT REACHED"
   });

}

global.usageStore[key]++;

console.log("FREE COUNT:",global.usageStore[key]);

next();

}catch(err){

console.log("USAGE CHECK ERROR:",err);

next();

}

}
