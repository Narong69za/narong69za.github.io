const jwt = require("jsonwebtoken");
const db = require("../db/db");

// =====================================================
// GOOGLE LOGIN CONTROLLER
// =====================================================

exports.googleLogin = async (payload) => {

  if (!payload || !payload.sub) {
    throw new Error("Invalid Google payload");
  }

  // ตรวจสอบว่ามี user หรือยัง
  let user = await db.getUserByGoogleId(payload.sub);

  // ถ้ายังไม่มี → สร้างใหม่
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

  // สร้าง JWT
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
