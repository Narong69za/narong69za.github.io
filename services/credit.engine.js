// =====================================================
// SN DESIGN ENGINE AI
// ULTRA CREDIT CORE ENGINE
// =====================================================

const db = require("../db/db");

// ===============================
// CONFIG COST PER MODEL
// ===============================

const COST_MAP = {

   text_to_video: 3,
   image_to_video: 4,
   motion_transfer: 5,
   face_swap: 6,
   lip_sync: 4,

   default: 3

};

// ===============================
// FREE LIMIT CHECK (IP BASED)
// ===============================

async function checkFreeUsage(ip){

   if(process.env.DEV_MODE === "true"){
      return true;
   }

   const today = new Date().toISOString().slice(0,10);

   global.freeUsage = global.freeUsage || {};

   const key = ip + "_" + today;

   if(!global.freeUsage[key]){
      global.freeUsage[key] = 0;
   }

   if(global.freeUsage[key] >= 3){
      return false;
   }

   global.freeUsage[key]++;

   return true;

}

// ===============================
// CHECK AND DEDUCT CREDIT
// ===============================

async function checkAndUseCredit(userId, alias){

   if(process.env.DEV_MODE === "true"){
      return { allowed:true };
   }

   const user = await db.getUser(userId);

   if(!user){
      return { allowed:false };
   }

   const cost = COST_MAP[alias] || COST_MAP.default;

   if(user.credits < cost){
      return { allowed:false };
   }

   await db.decreaseCredit(userId, cost);

   return { allowed:true, cost };

}

// ===============================
// ADD CREDIT
// ===============================

async function addCredit(userId, amount){

   await db.addCredit(userId, amount);

}

// ===============================

module.exports = {
   checkFreeUsage,
   checkAndUseCredit,
   addCredit
};
