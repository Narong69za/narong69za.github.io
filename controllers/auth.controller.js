const db = require("../db/db");

exports.googleLogin = async (payload)=>{

   let user = await db.getUser(payload.sub);

   if(!user){

      user = await db.createUser({
         id: payload.sub,
         email: payload.email,
         name: payload.name
      });

   }

   return user;

};
