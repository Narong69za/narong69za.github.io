// =====================================================
// SN DESIGN ENGINE AI
// PROMPTPAY QR PURE VERSION (PHONE + ID SUPPORT)
// =====================================================

const express = require("express");
const router = express.Router();

function crc16(str) {

    let crc = 0xFFFF;

    for (let i = 0; i < str.length; i++) {

        crc ^= str.charCodeAt(i) << 8;

        for (let j = 0; j < 8; j++) {

            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc <<= 1;
            }

        }

    }

    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
}

function buildPromptPayPayload(idOrPhone, amount){

    idOrPhone = idOrPhone.replace(/\D/g,'');

    let target = "";

    // เบอร์โทร
    if(idOrPhone.length === 10){

        if(idOrPhone.startsWith("0")){
            target = "0066" + idOrPhone.substring(1);
        }

    }
    // บัตรประชาชน 13 หลัก
    else if(idOrPhone.length === 13){

        target = "000" + idOrPhone;

    }else{

        throw new Error("INVALID PROMPTPAY NUMBER");

    }

    const amountStr = Number(amount).toFixed(2);

    let payload =
        "000201" +
        "010212" +
        "29370016A000000677010111" +
        "0113" + target +
        "5802TH" +
        "5303764" +
        "54" + amountStr.length.toString().padStart(2,"0") + amountStr +
        "6304";

    const crc = crc16(payload);

    return payload + crc;
}

// =====================================================
// CREATE PROMPTPAY QR
// =====================================================

router.post("/create", async (req,res)=>{

    try{

        const { amount } = req.body;

        if(!amount){
            return res.status(400).json({ error:"NO AMOUNT" });
        }

        const idOrPhone = "3100503536486";

        if(!idOrPhone){
            return res.status(500).json({ error:"PROMPTPAY_NUMBER NOT SET" });
        }

        const payload = buildPromptPayPayload(idOrPhone, amount);

        const qrUrl =
            "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
            encodeURIComponent(payload);

        res.json({ qrUrl });

    }catch(err){

        console.error(err);
        res.status(500).json({ error:"PROMPTPAY FAILED" });

    }

});

module.exports = router;
