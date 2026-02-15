# 实时对线助手 - 后端服务

基于 FastAPI + 通义千问 + 阿里云 Paraformer 的后端 API 服务。

## 功能特性

- **聊天 API** - 使用通义千问生成回复建议
- **实时语音识别** - 使用阿里云 Paraformer 进行实时语音转文字

## 快速开始

### 1. 创建虚拟环境（或使用 conda）

```bash
# 使用 conda
conda create -n wedding-api python=3.10
conda activate wedding-api

# 或使用 venv
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### 3. 配置环境变量

```bash
# 设置 API Key（从阿里云百炼控制台获取）
export DASHSCOPE_API_KEY="your-api-key"

# 或创建 .env 文件
cp .env.example .env
# 编辑 .env 文件，填入你的 API Key
```

获取 API Key: https://bailian.console.aliyun.com/

### 4. 启动服务

```bash
# 开发模式
uvicorn app:app --reload --port 3000

# 或者直接运行
python app.py
```

## API 接口

### POST /api/chat

获取建议回复

**请求体:**
```json
{
  "text": "你也老大不小了，什么时候结婚啊？",
  "style": "gentle"
}
```

**响应:**
```json
{
  "suggestion": "阿姨放心，我也想遇到合适的人再结，不想将就嘛~",
  "style": "gentle"
}
```

**风格说明:**
- `gentle`: 温和委婉
- `humor`: 幽默自嘲
- `rational`: 理性分析

### WebSocket /api/speech

实时语音识别（使用阿里云 Paraformer）

**连接流程:**
1. 前端建立 WebSocket 连接
2. 发送 16kHz PCM 音频数据
3. 接收识别结果（JSON 格式）

**返回格式:**
```json
{"status": "connected"}           // 连接成功
{"text": "你好", "is_final": false} // 中间结果
{"text": "你好世界", "is_final": true} // 最终结果
{"error": "错误信息"}              // 错误
```

### GET /api/health

健康检查

## 本地测试

```bash
# 终端 1: 启动后端
cd server
conda activate wedding-api
export DASHSCOPE_API_KEY="your-api-key"
uvicorn app:app --reload --port 3000

# 终端 2: 启动前端服务
cd h5-version
python -m http.server 8080

# 浏览器访问
open http://localhost:8080/realtime.html
```

## 注意事项

1. 语音识别需要 **dashscope** 库，确保已安装
2. API Key 从阿里云百炼控制台获取
3. 通义千问和 Paraformer 共用同一个 API Key
4. 免费额度：通义千问 100万 tokens/月，Paraformer 有相应免费额度
