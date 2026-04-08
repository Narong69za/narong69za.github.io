#!/data/data/com.termux/files/usr/bin/bash

BASE=~/narong69za.github.io

MASTER="$BASE/create.html"

VERSION=$(grep -i "VERSION" "$MASTER" | head -1 | awk '{print $3}' | tr -d 'v')

echo $VERSION
