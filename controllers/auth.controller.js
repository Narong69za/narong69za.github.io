const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const db = require("../db/db");

const client = new OAuth2Client(
  "322233270752-6itdqaskdsdbc7lu2t3fchm792slct4n.apps.googleusercontent.com"
);

exports.googleLogin = async (req, res) => {

  try {

    const { token: googleToken } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: "322233270752-6itdqaskdsdbc7lu2t3fchm792slct4n.apps.googleusercontent.com"
    });

    const payload = ticket.getPayload();

    let user = await db.getUser(payload.sub);

    if (!user) {
      user = await db.createUser({
        id: payload.sub,
        email: payload.email,
        name: payload.name
      });
    }

    const jwt = require("jsonwebtoken");
const db = require("../db/db");

exports.googleLogin = async (payload) => {

  const existingUser = await db.getUser(payload.sub);

  let user = existingUser;

  if (!user) {
    user = await db.createUser({
      id: payload.sub,
      email: payload.email,
      name: payload.name
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token };

};
