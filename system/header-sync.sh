#!/data/data/com.termux/files/usr/bin/bash

BASE=~/narong69za.github.io

MASTER_VERSION=$(system/version-master.sh)

echo "MASTER VERSION : $MASTER_VERSION"

find $BASE -type f ! -name "*.html" | while read file
do

HEADER=$(head -n 20 "$file")

echo "$HEADER" | grep -qi "PROJECT:" || continue

CURRENT=$(grep "VERSION: v

if [ "$CURRENT" != "$MASTER_VERSION" ]
then

echo "SYNC VERSION -> $file"

sed -i "s/VERSION: v

DATE=$(date +"%Y-%m-%d")

sed -i "s/LAST FIX: 2026-03-08

fi

done
