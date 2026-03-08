#!/data/data/com.termux/files/usr/bin/bash

BASE=~/narong69za.github.io
cd $BASE || exit

echo "SN DESIGN STUDIO FILE GUARDIAN"
echo "Scanning repository..."

find . -type f ! -name "*.html" -mtime +14 | while read file
do

HEADER=$(head -n 20 "$file")

echo "$HEADER" | grep -qi "PROJECT:" && continue
echo "$HEADER" | grep -qi "MODULE:" && continue
echo "$HEADER" | grep -qi "VERSION: v
echo "$HEADER" | grep -qi "SN DESIGN STUDIO" && continue
echo "$HEADER" | grep -qi "© SN Design Studio" && continue

echo "DELETE UNUSED FILE -> $file"

rm -f "$file"

done

echo "SCAN COMPLETE"
