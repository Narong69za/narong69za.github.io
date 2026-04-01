const sqlite3 = require('sqlite3').verbose();
const dbPath = '/home/ubuntu/sn-payment-core/database.db';

exports.processGiftLink = async (req, res) => {
  const db = new sqlite3.Database(dbPath);
  try {
    const { amount, giftLink } = req.body;
    if (!giftLink) return res.json({ success: false, message: "กรุณาใส่ลิงก์ซองของขวัญ" });

    const txId = "TMN_" + Date.now();
    
    // บันทึกลง DB รอการตรวจสอบ (สถานะ pending)
    const sql = "INSERT INTO payments (txId, amount, status, method) VALUES (?, ?, 'pending', 'truemoney')";
    db.run(sql, [txId, amount], (err) => {
      if (err) return res.json({ success: false, error: err.message });
      
      res.json({
        success: true,
        txId,
        message: "ระบบกำลังตรวจสอบซองของขวัญ..."
      });
    });
  } catch (err) {
    res.json({ success: false, error: err.message });
  } finally {
    db.close();
  }
};
