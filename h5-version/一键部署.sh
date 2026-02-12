#!/bin/bash
# 阿里云香港ECS一键部署脚本

echo "🚀 开始部署催婚防御助手..."

# 1. 更新系统
echo "📦 更新系统..."
apt update && apt upgrade -y

# 2. 安装Nginx
echo "📦 安装Nginx..."
apt install nginx -y

# 3. 启动Nginx
echo "🔧 启动Nginx..."
systemctl start nginx
systemctl enable nginx

# 4. 进入网站目录
echo "📁 进入网站目录..."
cd /var/www/html

# 5. 备份默认页面
echo "💾 备份默认页面..."
mv index.nginx-debian.html index.nginx-debian.html.bak

# 6. 创建目录结构
echo "📁 创建目录结构..."
mkdir -p css js images

# 7. 创建提示页面
echo "📝 创建提示页面..."
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>催婚防御助手</title>
  <style>
    * { margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      color: #fff;
    }
    .container {
      text-align: center;
      padding: 40px;
    }
    h1 { font-size: 48px; margin-bottom: 20px; }
    p { font-size: 18px; opacity: 0.9; }
    .success { font-size: 24px; margin-top: 30px; }
    .next { font-size: 14px; margin-top: 40px; opacity: 0.8; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎉 部署成功！</h1>
    <p>Nginx已运行，服务器已就绪</p>
    <div class="success">✅ 催婚防御助手基础版已上线</div>
    <div class="next">
      下一步：请上传h5-version的完整文件<br>
      使用FileZilla或Workbench编辑器上传<br>
      详细步骤请查看部署文档
    </div>
  </div>
</body>
</html>
EOF

echo "✅ 基础页面创建完成！"
echo ""
echo "📱 现在可以访问：http://你的公网IP"
echo ""
echo "📝 接下来需要："
echo "   1. 下载h5-version文件"
echo "   2. 使用FileZilla上传到 /var/www/html/"
echo "   3. 或者在Workbench中手动编辑文件"
echo ""
echo "💡 提示：可以复制h5-version/index.html的完整内容到服务器"
