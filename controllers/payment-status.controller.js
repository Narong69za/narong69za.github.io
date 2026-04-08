const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = '/root/sn-payment-core/database.db';

exports.checkStatus = async (req, res) => {
  const db = new sqlite3.Database('/root/sn-payment-core/database.db');
  try {
    const tx = req.query.tx;
    if (!tx) return res.json({ status: "invalid" });

    // ค้นหาในตารางว่า txId นี้จ่ายหรือยัง
    const sql = "SELECT status FROM payments WHERE txId = ?";
    
    db.get(sql, [tx], (err, row) => {
      if (err) {
        console.error(err);
        return res.json({ status: "error" });
      }
      
      if (!row) return res.json({ status: "not_found" });

      // ส่งสถานะจริงกลับไป (pending หรือ success)
      res.json({ status: row.status });
    });

  } catch (err) {
    res.json({ status: "error" });
  } finally {
    db.close();
  }
};
