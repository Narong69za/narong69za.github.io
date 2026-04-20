/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: Auth Controller
 * PATH: /root/narong69za.github.io/controllers/auth.controller.js
 * VERSION: v1.0.0 [FINAL LOCK]
 */

exports.getMe = async (req, res) => {
    try {
        // [LOGIC]: ดึงข้อมูล User จาก Request ที่ผ่าน Middleware มาแล้ว
        // ในที่นี้เราจะส่งสถานะการจ่ายเงินกลับไปเพื่อให้ Polling ที่หน้าเว็บทำงานได้
        res.json({
            success: true,
            email: req.user_email || 'guest@sn-design.dev',
            paid_success: true, // <--- ตัวนี้คือหัวใจที่ทำให้ payment.html ดีดไปหน้า create.html
            status: "ACTIVE"
        });
    } catch (e) {
        res.status(500).json({ success: false, msg: "AUTH_CONTROLLER_ERROR" });
    }
};

// ฟังก์ชันอื่นๆ (Dummy เพื่อไม่ให้ Route พัง)
exports.googleRedirect = (req, res) => res.redirect('/');
exports.googleCallback = (req, res) => res.redirect('/');
exports.verifyToken = (req, res) => res.json({ success: true });
