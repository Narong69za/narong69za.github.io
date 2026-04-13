/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: Auth Middleware
 * PATH: /root/narong69za.github.io/middleware/auth.js
 * VERSION: v1.0.0 [FINAL LOCK]
 */

module.exports = (req, res, next) => {
    // [SIMPLE AUTH]: รับค่า Email มาจาก Header หรือ Query เพื่อใช้ระบุตัวตน
    const userEmail = req.headers['authorization'] || req.query.email;
    
    if (!userEmail) {
        // ถ้าไม่มีการยืนยันตัวตน ให้ติดคุกอยู่ที่หน้าเดิม
        return res.status(401).json({ success: false, msg: "UNAUTHORIZED" });
    }

    req.user_email = userEmail;
    next();
};
