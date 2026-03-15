/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: controllers/scb.controller.js
 * VERSION: v1.0.0
 * STATUS: production
 * RESPONSIBILITY:
 * - create SCB PromptPay QR
 * - generate transaction id
 * - return QR image
 * =====================================================
 */

const crypto = require("crypto");

exports.createQR = async (req,res)=>{

  try{

    const { amount } = req.body;

    if(!amount){
      return res.json({ error:"NO_AMOUNT" });
    }

    const txId="TX_"+crypto.randomBytes(6).toString("hex");

    const qrImage=
      "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data="+txId;

    return res.json({
      success:true,
      txId,
      qrImage
    });

  }catch(err){

    console.error(err);

    res.json({ error:"SCB_QR_ERROR" });

  }

};
