const PromptPayQR = require("promptpay-qr");
const QRCode = require("qrcode");

exports.generate = async(amount,userId)=>{

    const payload = PromptPayQR(process.env.PROMPTPAY_NUMBER,{
        amount: amount
    });

    const qr = await QRCode.toDataURL(payload);

    return qr;
};
