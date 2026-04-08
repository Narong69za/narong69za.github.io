/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: services/keygen.service.js
 * VERSION: 1.0.0
 * =====================================================
 */

const crypto = require('crypto')

exports.generate = ()=>{

   const seed = Date.now().toString()

   const hash = crypto
      .createHmac('sha256',process.env.ACTIVATE_SECRET)
      .update(seed)
      .digest('hex')
      .slice(0,16)
      .toUpperCase()

   return `SNDS-${hash.slice(0,4)}-${hash.slice(4,8)}-${hash.slice(8,12)}-${hash.slice(12,16)}`

}
