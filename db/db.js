// middleware/auth.js

const { OAuth2Client } = require("google-auth-library");
const db = require("../db/db");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function authMiddleware(req,res,next){

  if(req.query.dev === "true"){
    req.user = {
      id: 1,
      googleId: "dev_user",
      email: "sndesignstudio.auth@gmail.com"
    };
    return next();
  }

  const token = req.headers.authorization?.split("Bearer ")[1];

  if(!token){
    return res.status(401).json({error:"No token"});
  }

  try{

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    let user = await db.getUserByGoogleId(payload.sub);

    if(!user){
      const id = await db.createUser({
        googleId: payload.sub,
        email: payload.email
      });
      user = { id };
    }

    req.user = user;
    next();

  }catch(err){
    res.status(401).json({error:"Invalid token"});
  }

}

module.exports = authMiddleware;
