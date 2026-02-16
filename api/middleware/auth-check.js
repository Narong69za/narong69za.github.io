module.exports = function(req,res,next){

   const devMode = req.headers["x-dev-mode"];

   // DEV MODE (test free)
   if(devMode === "true"){
      req.user = {
         id:"dev-user",
         dev:true
      };
      return next();
   }

   const token = req.headers.authorization;

   if(!token){
      return res.status(401).json({
         error:"AUTH REQUIRED"
      });
   }

   // TODO verify JWT จริง
   req.user = {
      id:"real-user",
      dev:false
   };

   next();
};
