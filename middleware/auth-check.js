// ADD ONLY

module.exports = function(req,res,next){

   const dev = req.headers["x-dev-mode"];

   // DEV bypass
   if(dev==="true"){
      req.user = { id:"dev-user", dev:true };
      return next();
   }

   const token = req.headers.authorization;

   if(!token){
      return res.status(401).json({error:"AUTH REQUIRED"});
   }

   // TODO verify JWT จริง
   req.user = { id:"real-user" };

   next();
};
