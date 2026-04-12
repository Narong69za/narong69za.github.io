const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    // ดึงกุญแจจาก Header: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // บรรทัดนี้แหละที่พี่เห็นใน Log!
        console.log("❌ [AUTH]: No Token Provided in Header");
        return res.status(401).json({ ok: false, error: "NO_TOKEN_IN_HEADER" });
    }

    try {
        const secret = "SN_ULTRA_ENGINE_2026_SECURE_KEY";
        req.user = jwt.verify(token, secret);
        next();
    } catch (err) {
        console.log("❌ [AUTH]: Token Invalid/Expired");
        return res.status(401).json({ ok: false, error: "TOKEN_INVALID" });
    }
};
