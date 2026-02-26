// ======================================================
// THAI QR PROMPTPAY SERVICE
// ======================================================

exports.createPromptPayQR = async ({amount,userId})=>{

   // ULTRA SIMPLE VERSION
   // ใช้ dynamic QR format

   return {
      type:"promptpay",
      qrData:`PROMPTPAY|${userId}|${amount}`,
      amount
   };

};
