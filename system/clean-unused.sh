#!/data/data/com.termux/files/usr/bin/bash

BASE=~/narong69za.github.io

echo "SCAN UNUSED FILES"

find $BASE -type f ! -name "*.html" -mtime +14 | while read file
do

HEADER=$(head -n 20 "$file")

echo "$HEADER" | grep -qi "PROJECT:" && continue

echo "DELETE UNUSED -> $file"

rm -f "$file"

done
