package com.wedding.defender.service;

import java.net.URI;
import java.nio.ByteBuffer;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;

import lombok.extern.slf4j.Slf4j;

/**
 * 语音识别服务 - 调用阿里云 Paraformer
 */
@Slf4j
@Service
public class SpeechService {

    @Value("${dashscope.api-key}")
    private String apiKey;

    @Value("${dashscope.speech-url}")
    private String speechUrl;

    private final ExecutorService executorService = Executors.newCachedThreadPool();

    /**
     * 语音识别会话
     */
    public static class SpeechSession {
        private WebSocketSession clientSession;
        private WebSocketSession dashscopeSession;
        private volatile boolean running = true;

        public WebSocketSession getClientSession() {
            return clientSession;
        }

        public void setClientSession(WebSocketSession clientSession) {
            this.clientSession = clientSession;
        }

        public WebSocketSession getDashscopeSession() {
            return dashscopeSession;
        }

        public void setDashscopeSession(WebSocketSession dashscopeSession) {
            this.dashscopeSession = dashscopeSession;
        }

        public boolean isRunning() {
            return running;
        }

        public void close() {
            running = false;
        }
    }

    /**
     * 启动语音识别会话
     */
    public SpeechSession startRecognition(WebSocketSession clientSession) {
        SpeechSession session = new SpeechSession();
        session.setClientSession(clientSession);

        if (apiKey == null || apiKey.isEmpty()) {
            sendError(clientSession, "API Key 未配置");
            session.close();
            return session;
        }

        executorService.submit(() -> {
            try {
                connectToDashscope(session);
            } catch (Exception e) {
                log.error("连接 Dashscope 失败", e);
                sendError(clientSession, "语音识别服务连接失败: " + e.getMessage());
                session.close();
            }
        });

        return session;
    }

    /**
     * 连接到 Dashscope WebSocket
     */
    private void connectToDashscope(SpeechSession session) throws Exception {
        StandardWebSocketClient client = new StandardWebSocketClient();

        String url = speechUrl + "?model=paraformer-realtime-v2&format=pcm&sample_rate=16000";

        URI uri = new URI(url);
        log.info("连接 Dashscope: {}", url);

        WebSocketSession dashscopeSession = client.execute(
                new org.springframework.websocket.handler.TextWebSocketHandler() {
                    @Override
                    public void afterConnectionEstablished(WebSocketSession wsSession) {
                        log.info("Dashscope 连接成功");
                        session.setDashscopeSession(wsSession);
                        sendMessage(session.getClientSession(), JSONObject.of("status", "connected"));
                    }

                    @Override
                    protected void handleTextMessage(WebSocketSession wsSession, TextMessage message) {
                        try {
                            String payload = message.getPayload();
                            log.info("收到 Dashscope 消息: {}", payload);

                            JSONObject json = JSONObject.parseObject(payload);

                            // 解析识别结果
                            if (json.containsKey("output")) {
                                JSONObject output = json.getJSONObject("output");
                                if (output.containsKey("sentence")) {
                                    JSONObject sentence = output.getJSONObject("sentence");
                                    String text = sentence.getString("text");
                                    boolean isFinal = sentence.getBooleanValue("end_of_sentence", false);

                                    JSONObject result = new JSONObject();
                                    result.put("text", text);
                                    result.put("is_final", isFinal);

                                    sendMessage(session.getClientSession(), result);
                                }
                            }

                            // 处理错误
                            if (json.containsKey("code") && !"Success".equals(json.getString("code"))) {
                                sendError(session.getClientSession(), json.getString("message"));
                                session.close();
                            }
                        } catch (Exception e) {
                            log.error("处理 Dashscope 消息失败", e);
                        }
                    }

                    @Override
                    public void afterConnectionClosed(WebSocketSession wsSession, org.springframework.web.socket.CloseStatus status) {
                        log.info("Dashscope 连接关闭: {}", status);
                        session.close();
                    }

                    @Override
                    public void handleTransportError(WebSocketSession wsSession, Throwable exception) {
                        log.error("Dashscope 传输错误", exception);
                        sendError(session.getClientSession(), "语音识别传输错误");
                        session.close();
                    }
                },
                null,
                uri,
                Map.of("Authorization", "Bearer " + apiKey)
        );

        // 发送开始命令
        JSONObject startCommand = new JSONObject();
        startCommand.put("header", JSONObject.of("action", "start"));
        startCommand.put("payload", JSONObject.of(
                "model", "paraformer-realtime-v2",
                "format", "pcm",
                "sample_rate", 16000,
                "language_hints", JSONArray.of("zh")
        ));

        dashscopeSession.sendMessage(new TextMessage(startCommand.toJSONString()));
    }

    /**
     * 发送音频数据
     */
    public void sendAudio(SpeechSession session, byte[] audioData) {
        if (session != null && session.getDashscopeSession() != null && session.isRunning()) {
            try {
                session.getDashscopeSession().sendMessage(new BinaryMessage(ByteBuffer.wrap(audioData)));
            } catch (Exception e) {
                log.error("发送音频数据失败", e);
            }
        }
    }

    /**
     * 停止识别
     */
    public void stopRecognition(SpeechSession session) {
        if (session == null) {
            return;
        }

        session.close();

        try {
            if (session.getDashscopeSession() != null && session.getDashscopeSession().isOpen()) {
                // 发送停止命令
                JSONObject stopCommand = new JSONObject();
                stopCommand.put("header", JSONObject.of("action", "stop"));
                session.getDashscopeSession().sendMessage(new TextMessage(stopCommand.toJSONString()));

                session.getDashscopeSession().close();
            }
        } catch (Exception e) {
            log.error("关闭 Dashscope 连接失败", e);
        }

        log.info("语音识别会话已停止");
    }

    /**
     * 发送消息到客户端
     */
    private void sendMessage(WebSocketSession session, JSONObject message) {
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(message.toJSONString()));
            } catch (Exception e) {
                log.error("发送消息失败", e);
            }
        }
    }

    /**
     * 发送错误消息
     */
    private void sendError(WebSocketSession session, String error) {
        sendMessage(session, JSONObject.of("error", error));
    }
}
