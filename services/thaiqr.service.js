// =====================================================
// SIMPLE PROMPTPAY QR (STATIC FORMAT)
// =====================================================

const generatePayload = require("promptpay-qr");
const QRCode = require("qrcode");

// ต้อง npm install promptpay-qr qrcode

exports.createQR = async ({ amount }) => {

   const mobileNumber = process.env.PROMPTPAY_NUMBER; 
   // ใส่เบอร์พร้อมเพย์คุณใน .env

   const payload = generatePayload(mobileNumber, { amount });

   const qrImage = await QRCode.toDataURL(payload);

   return {
      success:true,
      qr: qrImage
   };
};
