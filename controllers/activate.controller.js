/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: controllers/activate.controller.js
 * VERSION: 1.0.0
 * =====================================================
 */

const keyService = require('../services/keygen.service')

exports.generateKey = async(req,res)=>{

   const key = keyService.generate()

   res.json({
      success:true,
      key:key
   })

}
