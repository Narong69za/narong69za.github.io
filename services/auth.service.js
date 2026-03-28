exports.check = async function(req){

   const token = req.headers.authorization;

   if(!token){

      throw new Error("AUTH REQUIRED");

   }

   /* dev bypass */

   if(token==="dev-mode"){

      return {
         id:"dev",
         dev:true
      }

   }

   return {
      id:"google-user",
      dev:false
   }

}
