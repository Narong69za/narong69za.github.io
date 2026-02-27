const jwt = require('jsonwebtoken');

exports.verifyAccessToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
