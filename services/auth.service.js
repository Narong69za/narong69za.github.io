const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogle(token){

   const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
   });

   const payload = ticket.getPayload();

   return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture
   };

}

module.exports = { verifyGoogle };
