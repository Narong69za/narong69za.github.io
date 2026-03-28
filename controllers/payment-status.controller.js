/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: controllers/payment-status.controller.js
 * VERSION: v1.0.0
 * STATUS: production
 * RESPONSIBILITY:
 * - transaction status check
 * - used by polling system
 * =====================================================
 */

exports.checkStatus = async (req,res)=>{

  try{

    const tx=req.query.tx;

    if(!tx){
      return res.json({ status:"invalid" });
    }

    return res.json({
      status:"pending"
    });

  }catch(err){

    res.json({ status:"error" });

  }

};
