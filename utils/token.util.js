const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
  return jwt.sign(
    {
      user_id: user.id,
      email: user.email,
      role: user.role,
      subscription: user.subscription
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    {
      user_id: user.id
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};
