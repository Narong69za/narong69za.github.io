/**
 * =====================================================
 * MODULE : api/api.activate.js
 * PURPOSE: Verify activation key from Terminal / Python
 * =====================================================
 */

import express from "express"

const router = express.Router()

// Mock database (เปลี่ยนเป็น DB จริงภายหลัง)
const LICENSE_DB = [
  {
    key: "SN-FREE-ABCD-EFGH",
    plan: "free",
    expire: "2026-12-01",
    device_id: null
  },
  {
    key: "SN-PRO-K2Q8-9SLA",
    plan: "pro",
    expire: "2026-12-01",
    device_id: null
  },
  {
    key: "SN-HOST-7QPA-33SD",
    plan: "host",
    expire: "2026-12-01",
    device_id: null
  }
]

router.post("/api/activate", (req,res)=>{

  const {key,device_id} = req.body

  if(!key){
    return res.json({
      status:"error",
      message:"key_required"
    })
  }

  const license = LICENSE_DB.find(l => l.key === key)

  if(!license){
    return res.json({
      status:"invalid_key"
    })
  }

  const now = new Date()
  const expire = new Date(license.expire)

  if(now > expire){
    return res.json({
      status:"expired"
    })
  }

  // lock device
  if(license.device_id && license.device_id !== device_id){
    return res.json({
      status:"device_locked"
    })
  }

  if(!license.device_id){
    license.device_id = device_id
  }

  return res.json({
    status:"ok",
    plan:license.plan,
    expire:license.expire
  })

})

export default router
