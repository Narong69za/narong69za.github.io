const generatePayload = require("promptpay-qr");
const qrcode = require("qrcode");
const crypto = require("crypto");

exports.createQR = async (req, res) => {
  try {
    const { amount } = req.body;
    
    // *** สำคัญมาก: เปลี่ยนเป็นเลขบัตรประชาชนพี่ที่ผูก PromptPay SCB ***
    const myID = "3100503536486"; 

    if (!amount) return res.json({ error: "NO_AMOUNT" });

    const payload = generatePayload(myID, { amount: parseFloat(amount) });
   
    const qrImage = await qrcode.toDataURL(payload);
    
    const txId = "TX_" + crypto.randomBytes(6).toString("hex");

    return res.json({
      success: true,
      txId,
      qrImage
    });

  } catch (err) {
    console.error(err);
    res.json({ error: "SCB_QR_ERROR" });
  }
};
