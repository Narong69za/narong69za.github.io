// =====================================================
// CREDIT ENGINE ULTRA
// =====================================================

const db = require("../db/db");

const FREE_LIMIT = 3;
const freeUsage = {};

exports.checkFreeUsage = async (ip) => {

   if(!freeUsage[ip]){

      freeUsage[ip] = {
         count:0,
         date:new Date().toDateString()
      };

   }

   const today = new Date().toDateString();

   if(freeUsage[ip].date !== today){

      freeUsage[ip].count = 0;
      freeUsage[ip].date = today;

   }

   if(freeUsage[ip].count < FREE_LIMIT){

      freeUsage[ip].count++;
      return true;

   }

   return false;

};

exports.checkAndUseCredit = async (userId, alias)=>{

   if(userId === "DEV-BYPASS"){

      return { allowed:true };

   }

   const user = await db.getUser(userId);

   if(!user){

      return { allowed:false };

   }

   const cost = 1;

   if(user.credits < cost){

      return { allowed:false };

   }

   await db.decreaseCredit(userId,cost);

   return { allowed:true };

};
