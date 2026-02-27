const jwt = require("jsonwebtoken");
const db = require("../db/db");

exports.googleLogin = async (payload) => {

  if (!payload || !payload.sub) {
    throw new Error("Invalid Google payload");
  }

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
