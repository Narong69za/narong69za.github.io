exports.processWallet = async (req, res) => {
  try {
    const { amount, phoneNumber } = req.body;
    if (!amount) return res.json({ error: "NO_AMOUNT" });
    
    // ตรงนี้คือจุดเชื่อมกับ API TrueMoney หรือระบบเช็คซองของพี่
    const txId = "TMN_" + Date.now();
    
    // สมมติส่ง URL สำหรับยืนยันการจ่ายกลับไป
    res.json({
      success: true,
      txId,
      message: "READY_FOR_WALLET_PAYMENT",
      amount
    });
  } catch (err) {
    res.json({ error: "TRUEMONEY_ERROR" });
  }
};
