#!/data/data/com.termux/files/usr/bin/bash

BASE=~/narong69za.github.io

cd $BASE || exit

echo "SN DESIGN STUDIO AUTO SYSTEM"

system/header-sync.sh

system/clean-unused.sh

git add .

git commit -m "auto sync $(date)" 2>/dev/null

git push origin main
