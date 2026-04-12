router.post("/stripe", async (req, res) => {
    // 1. รับข้อมูล (Universal Fix)
    const event = (typeof req.body === 'object') ? req.body : JSON.parse(req.body.toString());
} catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
}

    // 2. เช็คเงื่อนไขเฉพาะของ Stripe
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        // 3. เตรียมข้อมูลลง DB (ดึงจาก Metadata ที่เราฝังไว้ตอนสร้าง Session)
        const userId = session.metadata?.userId || "1";
        const credits = parseInt(session.metadata?.credits) || 0;
        const amount = session.amount_total / 100;
        const txId = session.id;

        // 4. บันทึกลง Database (โครงสร้างมาตรฐาน)
        const db = new sqlite3.Database(dbPath);
        db.serialize(() => {
            // บันทึกเงินเข้า (เพื่อให้ Dashboard เลขขยับ)
            db.run("INSERT OR IGNORE INTO payments (txId, userId, amount, status) VALUES (?, ?, ?, 'success')", 
                   [txId, userId, amount]);
            
            // เติมเครดิตให้ลูกค้า
            db.run("UPDATE users SET credits = credits + ? WHERE id = ?", [credits, userId]);
        });
        db.close();
        
        console.log(`✅ Success: User ${userId} +${credits} Credits`);
    }

    res.json({ received: true });
});

