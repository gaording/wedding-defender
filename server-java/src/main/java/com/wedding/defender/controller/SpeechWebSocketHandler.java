package com.wedding.defender.controller;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;

import com.wedding.defender.service.SpeechService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 语音识别 WebSocket 处理器
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SpeechWebSocketHandler extends BinaryWebSocketHandler {

    private final SpeechService speechService;

    // 存储会话
    private final Map<String, SpeechService.SpeechSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("WebSocket 连接建立: {}", session.getId());

        SpeechService.SpeechSession speechSession = speechService.startRecognition(session);
        sessions.put(session.getId(), speechSession);
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) {
        SpeechService.SpeechSession speechSession = sessions.get(session.getId());

        if (speechSession != null && speechSession.isRunning()) {
            byte[] audioData = message.getPayload().array();
            speechService.sendAudio(speechSession, audioData);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        log.debug("收到文本消息: {}", message.getPayload());
        // 文本消息暂不处理
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        log.info("WebSocket 连接关闭: {}, 状态: {}", session.getId(), status);

        SpeechService.SpeechSession speechSession = sessions.remove(session.getId());
        if (speechSession != null) {
            speechService.stopRecognition(speechSession);
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        log.error("WebSocket 传输错误: {}", session.getId(), exception);

        try {
            if (session.isOpen()) {
                session.sendMessage(new TextMessage("{\"error\":\"传输错误\"}"));
            }
        } catch (IOException e) {
            log.error("发送错误消息失败", e);
        }
    }
}
