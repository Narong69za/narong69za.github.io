// middleware/checkCredit.js

const db = require("../db/db");

module.exports = async (req,res,next)=>{

  try{

    const userId = req.headers["x-user-id"];

    if(!userId){
      return res.status(401).json({error:"NO USER"});
    }

    const user = await db.getUser(userId);

    if(!user){
      return res.status(404).json({error:"USER NOT FOUND"});
    }

    if(user.credits <= 0){
      return res.status(402).json({error:"NO CREDIT"});
    }

    req.user = user;

    next();

  }catch(err){
    res.status(500).json({error:"CREDIT CHECK FAILED"});
  }

};
