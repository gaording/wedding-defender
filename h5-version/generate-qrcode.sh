#!/bin/bash

# 二维码生成脚本
# 用法：./generate-qrcode.sh "你的链接"

if [ -z "$1" ]; then
  echo "用法: $0 \"你的链接\""
  echo "示例: $0 \"https://wedding-defender.vercel.app\""
  exit 1
fi

URL="$1"
OUTPUT="qrcode.png"

echo "正在生成二维码..."
echo "链接: $URL"

# 使用免费的二维码API
curl -s "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${URL}" -o "$OUTPUT"

if [ $? -eq 0 ]; then
  echo "✅ 二维码已生成: $OUTPUT"
  echo ""
  echo "你可以："
  echo "1. 直接分享这个图片"
  echo "2. 打印出来贴在春节聚会上"
  echo "3. 发到群里让大家扫码"
else
  echo "❌ 生成失败，请检查网络"
  exit 1
fi
