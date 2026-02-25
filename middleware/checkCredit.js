module.exports = async (req,res,next)=>{

 const userId = req.headers["x-user-id"];

 if(!userId) return res.status(401).json({error:"NO USER"});

 const user = await db.getUser(userId);

 if(user.credits <= 0){

   return res.status(402).json({
      error:"NO CREDIT"
   });

 }

 req.user = user;

 next();

};
