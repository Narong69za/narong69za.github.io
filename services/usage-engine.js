// =============================
// ULTRA CREDIT ENGINE
// =============================

const usageStore = {};

function getClientIP(req){

   return (
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "unknown"
   );

}


// =============================
// CHECK USAGE
// =============================

function checkUsage(req){

   // DEV MODE bypass
   if(process.env.DEV_MODE === "true"){

      return {
         allow:true,
         remaining:"DEV UNLIMITED"
      };

   }

   const ip = getClientIP(req);

   const today = new Date().toDateString();

   if(!usageStore[ip]){
      usageStore[ip] = {
         date:today,
         count:0
      };
   }

   // reset daily
   if(usageStore[ip].date !== today){

      usageStore[ip] = {
         date:today,
         count:0
      };

   }

   if(usageStore[ip].count >= 3){

      return {
         allow:false,
         remaining:0
      };

   }

   usageStore[ip].count++;

   return {
      allow:true,
      remaining: 3 - usageStore[ip].count
   };

}


module.exports = {
   checkUsage
};
