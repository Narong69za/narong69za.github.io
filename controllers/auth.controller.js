const jwt = require("jsonwebtoken");
const db = require("../db/db");

// =====================================================
// GOOGLE LOGIN CONTROLLER (CLEAN VERSION)
// =====================================================

exports.googleLogin = async (payload) => {

  if (!payload || !payload.sub) {
    throw new Error("Invalid Google payload");
  }

  let user = await db.getUserByGoogleId(payload.sub);

  if (!user) {
    const newId = await db.createUser({
      googleId: payload.sub,
      email: payload.email
    });

    user = {
      id: newId,
      email: payload.email
    };
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
