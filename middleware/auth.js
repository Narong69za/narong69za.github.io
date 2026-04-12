const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("❌ [AUTH]: No Token Provided");
        return res.status(401).json({ ok: false });
    }

    try {
        const decoded = jwt.verify(token, "SN_ULTRA_ENGINE_2026_SECURE_KEY");
        req.user = decoded;
        next();
    } catch (err) {
        console.log("❌ [AUTH]: Token Invalid/Expired");
        return res.status(401).json({ ok: false });
    }
};
