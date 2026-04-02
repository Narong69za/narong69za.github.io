/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: controllers/scb.controller.js
 * VERSION: v2.5.0 (MIN 5 THB & EXPIRY INJECTED)
 * LAST UPDATE: 2026-04-02
 * =====================================================
 */

const generatePayload = require("promptpay-qr");
const qrcode = require("qrcode");
const crypto = require("crypto");

exports.createQR = async (req, res) => {
  try {
    const { amount } = req.body;
    
    // *** เลขบัตรประชาชนที่ผูก PromptPay SCB (คงเดิมตามต้นฉบับ) ***
    const myID = "3100503536486"; 

    // 1. ตรวจสอบค่า Amount และบังคับขั้นต่ำ 5 บาท
    const parsedAmount = parseFloat(amount);
    if (!amount || parsedAmount < 5) {
      return res.json({ 
        success: false,
        error: "INVALID_AMOUNT",
        message: "ขั้นต่ำการชำระเงินคือ 5 บาท" 
      });
    }

    // 2. สร้าง PromptPay Payload
    const payload = generatePayload(myID, { amount: parsedAmount });
   
    // 3. แปลงเป็น QR Code Base64
    const qrImage = await qrcode.toDataURL(payload);
    
    // 4. สร้าง Transaction ID แบบสุ่ม
    const txId = "TX_" + crypto.randomBytes(6).toString("hex");

    // 5. ส่งค่ากลับพร้อมข้อมูลเวลาหมดอายุ (300 วินาที = 5 นาที)
    return res.json({
      success: true,
      txId,
      qrImage,
      amount: parsedAmount,
      expiresIn: 300, // หน่วยเป็นวินาที สำหรับทำ Countdown หน้าบ้าน
      expiredAt: new Date(Date.now() + 5 * 60 * 1000) // เวลาหมดอายุจริง (Server Time)
    });

  } catch (err) {
    console.error("SCB_QR_GENERATION_ERROR:", err);
    res.json({ 
      success: false, 
      error: "SCB_QR_ERROR",
      message: "ไม่สามารถสร้าง QR Code ได้ในขณะนี้"
    });
  }
};

