#!/bin/bash

# =====================================================
# PROJECT: SN DESIGN STUDIO - FINAL SYNC
# DESCRIPTION: เคลียร์ไฟล์ขยะและอัปเดตขึ้น GitHub แบบสะอาด
# =====================================================

echo "�[1/3] Cleaning up Git cache..."
# ลบ cache เดิมออกเพื่อให้ .gitignore ทำงานได้เต็มที่
git rm -r --cached . > /dev/null 2>&1

echo "�[2/3] Adding clean files..."
# เพิ่มเฉพาะไฟล์ที่ไม่อยู่ใน .gitignore
git add .

echo "�[3/3] Committing & Pushing..."
COMMIT_MSG="Final SaaS Production Backend - Clean & Stable $(date '+%Y-%m-%d %H:%M')"
git commit -m "$COMMIT_MSG"

# ส่งขึ้น GitHub
git push origin main

echo "------------------------------------------------"
echo "✅ GITHUB SYNC COMPLETED!"
echo "✨ โค้ดของคุณถูกจัดเก็บอย่างสะอาดและปลอดภัยแล้วครับ"
echo "------------------------------------------------"
...
