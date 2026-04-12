const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = (authHeader && authHeader.split(' ')[1]) || req.cookies?.access_token;
    if (!token) return res.status(401).json({ ok: false });
    try {
        req.user = jwt.verify(token, "SN_ULTRA_ENGINE_2026_SECURE_KEY");
        next();
    } catch (e) { res.status(401).json({ ok: false }); }
};
