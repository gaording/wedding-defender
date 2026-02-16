# 实时对线助手 - Java 后端服务

基于 Spring Boot 3.2 + 通义千问 + 阿里云 Paraformer 的后端 API 服务。

## 技术栈

- Java 17
- Spring Boot 3.2
- WebSocket
- Apache HttpClient 5

## 快速开始

### 1. 配置环境变量

```bash
export DASHSCOPE_API_KEY="你的API密钥"
```

### 2. 编译运行

```bash
# 编译
mvn clean package -DskipTests

# 运行
java -jar target/defender-server-1.0.0.jar
```

### 3. 开发模式

```bash
mvn spring-boot:run
```

## API 接口

### POST /api/chat

获取建议回复

**请求体:**
```json
{
  "text": "你也老大不小了，什么时候结婚啊？",
  "style": "gentle",
  "attitude": "decline"
}
```

**响应:**
```json
{
  "suggestion": "谢谢阿姨关心，我现在工作太忙了，等稳定些再说吧~",
  "style": "gentle",
  "attitude": "decline"
}
```

**参数说明:**
- `style`: 表达风格 - `gentle`(温和) / `humor`(幽默) / `rational`(理性)
- `attitude`: 回应态度 - `decline`(委婉拒绝) / `accept`(接受建议)

### WebSocket /api/speech

实时语音识别（使用阿里云 Paraformer）

### GET /api/health

健康检查

## 部署到阿里云

### 1. 打包

```bash
mvn clean package -DskipTests
```

### 2. 上传到服务器

```bash
scp target/defender-server-1.0.0.jar ecs-user@your-server:/home/ecs-user/wedding-defender/
```

### 3. 创建 systemd 服务

```bash
sudo cat > /etc/systemd/system/wedding-api.service << 'EOF'
[Unit]
Description=Wedding Defender API (Java)
After=network.target

[Service]
User=ecs-user
WorkingDirectory=/home/ecs-user/wedding-defender
Environment="DASHSCOPE_API_KEY=你的API密钥"
ExecStart=/usr/bin/java -jar /home/ecs-user/wedding-defender/defender-server-1.0.0.jar
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable wedding-api
sudo systemctl start wedding-api
```

### 4. 检查状态

```bash
sudo systemctl status wedding-api
curl http://localhost:3000/api/health
```
