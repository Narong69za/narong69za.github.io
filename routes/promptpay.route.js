const express = require("express"), multer = require("multer"), router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// upload.any() คือรับทุกอย่างที่ส่งมา ไม่จำกัดชื่อ field
router.post("/verify", upload.any(), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "NO_SLIP", message: "ส่งไฟล์สลิปมาด้วยครับพี่" });
        }
        
        // ดึงไฟล์แรกที่เจอออกมาใช้งาน
        const slipBuffer = req.files[0].buffer;
        console.log("--- ตรวจพบสลิป: " + req.files[0].originalname + " ---");

        // จำลองผลลัพธ์ (หรือเรียก verifySlip จริงของพี่ต่อได้เลย)
        res.json({ 
            success: true, 
            message: "ระบบได้รับสลิปแล้ว!", 
            debug: { fieldName: req.files[0].fieldname, size: req.files[0].size } 
        });

    } catch (e) { res.status(500).json({ error: "SERVER_ERROR", details: e.message }); }
});
module.exports = router;
