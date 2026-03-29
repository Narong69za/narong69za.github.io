#!/bin/bash
# ============================================================= MASTER UNIFIED DEPLOYER 
# (FRONTEND -> BACKEND SYNC) =============================================================
echo "🚀 [SYSTEM] ตรวจพบการอัปเดต... เริ่มต้นกลไก Unified Deploy..."
# 1. อัปเดตไฟล์ในโฟลเดอร์หน้าบ้าน (ที่เก็บ Routes/Logic ไว้)
cd ~/narong69za.github.io git fetch --all git reset --hard origin/main
# 2. ติดตั้ง Library ในหน้าบ้าน (ป้องกัน Error: Cannot find module 'express') เพราะ Backend 
# วิ่งมาเรียกไฟล์จากที่นี่ มันต้องมี node_modules พร้อมใช้งาน
echo "📦 [DEPENDENCY] ตรวจสอบและติดตั้ง Library ในโฟลเดอร์หน้าบ้าน..." npm install --quiet
# 3. สั่งรีสตาร์ทกัปตัน 5002 (เพื่อให้โหลดไฟล์ Route ใหม่ที่เพิ่ง Pull มา)
echo "🔄 [PM2] สั่งรีสตาร์ท sn-api เพื่อโหลด Logic ล่าสุด..." pm2 restart sn-api --update-env echo "✅ 
[SUCCESS] ระบบอัปเดตและออนไลน์แล้ว 100%!" pm2 status sn-api
