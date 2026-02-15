"""
实时对线助手 - 后端 API
使用 FastAPI + 通义千问 + 阿里云 Paraformer 语音识别
"""

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import httpx
import os
import logging
import asyncio
import json

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="实时对线助手 API",
    description="催婚应对顾问后端服务 - 支持实时语音识别",
    version="2.0.0"
)

# 允许跨域
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 配置
DASHSCOPE_API_KEY = os.getenv("DASHSCOPE_API_KEY", "")
DASHSCOPE_CHAT_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"


# ============ 聊天 API ============

class ChatRequest(BaseModel):
    text: str
    style: str = "gentle"
    attitude: str = "decline"  # decline(拒绝) 或 accept(接受)


class ChatResponse(BaseModel):
    suggestion: str
    style: str
    attitude: str


STYLE_PROMPTS = {
    "gentle": {
        "desc": "温和委婉，语气柔和",
        "examples": ["谢谢关心，我正在努力呢~", "您说得对，我会留意的~"]
    },
    "humor": {
        "desc": "幽默风趣，轻松调侃",
        "examples": ["哈哈，要不您帮我介绍一个？", "我这不是在攒钱嘛~"]
    },
    "rational": {
        "desc": "理性客观，讲道理",
        "examples": ["现在工作确实忙，想先稳定事业~", "我想遇到合适的人再结婚~"]
    }
}

ATTITUDE_PROMPTS = {
    "decline": {
        "desc": "委婉拒绝对方的催婚建议，表达自己的困难和想法",
        "structure": """1. 先感谢对方的关心
2. 说明自己的困难（工作忙、圈子小、没遇到合适的、经济压力等）
3. 表明需要时间，不着急
4. 语气委婉，不让对方难堪""",
        "examples": [
            "谢谢阿姨关心，我现在工作太忙了，实在没精力顾及这方面，等稳定些再说吧~",
            "您说得对，但我周围圈子确实太小了，遇不到合适的，这事急不来~",
            "我也想啊，但还没遇到聊得来的人，总不能随便找个人就结婚吧~",
            "现在房贷压力大，想先把经济基础打好，再考虑个人问题~"
        ]
    },
    "accept": {
        "desc": "接受对方的建议，表示会考虑和行动",
        "structure": """1. 感谢对方的建议和关心
2. 认同对方说得有道理
3. 表明会采取行动（会留意、会去相亲、会考虑介绍等）
4. 态度积极，让对方放心""",
        "examples": [
            "谢谢阿姨提醒，您说得对，我最近确实该多出去认识认识人了~",
            "好的，我会留意的，有合适的我也会主动接触~",
            "嗯，我最近有在看相亲软件了，有合适的会把握住~",
            "您帮我留意一下也行，有机会我就去见见~"
        ]
    }
}


def build_prompt(text: str, style: str, attitude: str) -> str:
    style_info = STYLE_PROMPTS.get(style, STYLE_PROMPTS["gentle"])
    attitude_info = ATTITUDE_PROMPTS.get(attitude, ATTITUDE_PROMPTS["decline"])

    style_examples = "\n".join([f"- {e}" for e in style_info["examples"]])
    attitude_examples = "\n".join([f"- {e}" for e in attitude_info["examples"]])

    return f'''你是催婚应对顾问，帮用户给亲戚朋友一个得体的回复。

## 对方说
「{text}」

## 回复态度
{attitude_info["desc"]}

回复结构：
{attitude_info["structure"]}

## 表达风格
{style_info["desc"]}

## 示例回复
态度示例：
{attitude_examples}

风格示例：
{style_examples}

## 要求
- 回复长度：25-50字
- 语气自然口语化
- 要有具体内容，不要空话

直接输出回复（不要引号）：'''


async def call_qwen_api(prompt: str) -> str:
    if not DASHSCOPE_API_KEY:
        return None

    headers = {
        "Authorization": f"Bearer {DASHSCOPE_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "qwen-plus",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 100,
        "temperature": 0.8
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(DASHSCOPE_CHAT_URL, headers=headers, json=payload)
            if response.status_code != 200:
                logger.error(f"Chat API error: {response.status_code}")
                return None
            data = response.json()
            return data["choices"][0]["message"]["content"].strip()
    except Exception as e:
        logger.error(f"Chat API call failed: {e}")
        return None


FALLBACK_RESPONSES = {
    "decline": {
        "gentle": [
            "谢谢阿姨关心，我现在工作太忙了，这事以后再说吧~",
            "我也想啊，但圈子太小了，遇不到合适的~",
            "您说得对，但缘分这事儿急不来~",
        ],
        "humor": [
            "哈哈，我这不是在努力赚钱嘛，先立业再成家~",
            "要不您帮我物色物色？我这确实没渠道~",
            "每天加班到这么晚，哪有时间谈恋爱呀~",
        ],
        "rational": [
            "现在工作压力大，想先把事业稳定下来~",
            "房子还在还贷，经济基础还不够扎实~",
            "我想遇到合适的人再结婚，不想将就~",
        ],
    },
    "accept": {
        "gentle": [
            "谢谢阿姨提醒，我最近会多留意这方面的~",
            "您说得对，我确实该主动一点了~",
            "好的，有合适的我会把握住的~",
        ],
        "humor": [
            "哈哈，那我最近多出去转转，看看能不能遇到~",
            "行，您帮我留意一下，有机会我就去见见~",
            "好的好的，我这就去下载个相亲软件~",
        ],
        "rational": [
            "您说得有道理，我最近确实在考虑这个问题~",
            "我会试着多参加一些社交活动的~",
            "已经在看了，有合适的会主动接触~",
        ],
    }
}


def get_fallback_response(style: str, attitude: str = "decline") -> str:
    import random
    attitude_responses = FALLBACK_RESPONSES.get(attitude, FALLBACK_RESPONSES["decline"])
    responses = attitude_responses.get(style, attitude_responses["gentle"])
    return random.choice(responses)


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.text or len(request.text.strip()) < 2:
        raise HTTPException(status_code=400, detail="请输入更长的内容")

    style = request.style if request.style in STYLE_PROMPTS else "gentle"
    attitude = request.attitude if request.attitude in ATTITUDE_PROMPTS else "decline"

    prompt = build_prompt(request.text, style, attitude)
    suggestion = await call_qwen_api(prompt)

    if not suggestion:
        suggestion = get_fallback_response(style, attitude)

    return ChatResponse(suggestion=suggestion, style=style, attitude=attitude)


# ============ 语音识别 WebSocket API ============

@app.websocket("/api/speech")
async def speech_websocket(websocket: WebSocket):
    """
    WebSocket 接口用于实时语音识别
    前端发送音频数据，后端调用阿里云 Paraformer 返回识别结果
    """
    await websocket.accept()
    logger.info("WebSocket connection accepted")

    recognition = None
    loop = asyncio.get_event_loop()
    message_queue = asyncio.Queue()

    # 后台任务：发送消息到 WebSocket
    async def message_sender():
        while True:
            try:
                msg = await asyncio.wait_for(message_queue.get(), timeout=1.0)
                if msg is None:  # 停止信号
                    break
                await websocket.send_json(msg)
            except asyncio.TimeoutError:
                continue
            except Exception as e:
                logger.error(f"Send message error: {e}")
                break

    # 启动消息发送任务
    sender_task = asyncio.create_task(message_sender())

    try:
        import dashscope
        from dashscope.audio.asr import Recognition, RecognitionCallback, RecognitionResult

        if not DASHSCOPE_API_KEY:
            await websocket.send_json({"error": "API Key 未配置"})
            return

        dashscope.api_key = DASHSCOPE_API_KEY

        # 线程安全的消息发送函数
        def send_message(msg):
            try:
                asyncio.run_coroutine_threadsafe(message_queue.put(msg), loop)
            except Exception as e:
                logger.error(f"Queue message error: {e}")

        # 回调类
        class WebSocketCallback(RecognitionCallback):
            def on_open(self):
                logger.info("Paraformer connection opened")
                send_message({"status": "connected"})

            def on_close(self):
                logger.info("Paraformer connection closed")

            def on_complete(self):
                logger.info("Recognition completed")
                send_message({"status": "completed"})

            def on_error(self, result):
                logger.error(f"Recognition error: {result.message}")
                send_message({"error": result.message})

            def on_event(self, result: RecognitionResult):
                sentence = result.get_sentence()
                if 'text' in sentence:
                    is_final = RecognitionResult.is_sentence_end(sentence)
                    send_message({
                        "text": sentence['text'],
                        "is_final": is_final
                    })
                    logger.info(f"Recognition result: {sentence['text']}, is_final: {is_final}")

        callback = WebSocketCallback()
        recognition = Recognition(
            model='paraformer-realtime-v2',
            format='pcm',
            sample_rate=16000,
            language_hints=['zh'],
            callback=callback
        )
        recognition.start()
        logger.info("Recognition started")

        # 接收前端发送的音频数据
        while True:
            try:
                data = await websocket.receive_bytes()
                recognition.send_audio_frame(data)
            except WebSocketDisconnect:
                logger.info("WebSocket disconnected")
                break
            except Exception as e:
                logger.error(f"Error receiving data: {e}")
                break

    except ImportError:
        await websocket.send_json({"error": "dashscope 库未安装，请运行: pip install dashscope"})
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        import traceback
        traceback.print_exc()
        await websocket.send_json({"error": str(e)})
    finally:
        # 停止消息发送任务
        await message_queue.put(None)
        sender_task.cancel()

        if recognition:
            try:
                recognition.stop()
            except:
                pass
        logger.info("WebSocket connection closed")


# ============ 健康检查 ============

@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "api_key_set": bool(DASHSCOPE_API_KEY),
        "version": "2.0.0",
        "features": ["chat", "speech_recognition"]
    }


@app.get("/")
async def root():
    return {
        "name": "实时对线助手 API",
        "version": "2.0.0",
        "endpoints": {
            "chat": "/api/chat",
            "speech": "/api/speech (WebSocket)",
            "health": "/api/health"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
