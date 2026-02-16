package com.wedding.defender.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wedding.defender.model.ChatRequest;
import com.wedding.defender.model.ChatResponse;
import com.wedding.defender.service.ChatService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

/**
 * 聊天 API 控制器
 */
@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    /**
     * 获取建议回复
     */
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@Validated @RequestBody ChatRequest request) {
        log.info("收到聊天请求: text={}, style={}, attitude={}",
                request.getText(), request.getStyle(), request.getAttitude());

        String suggestion = chatService.getSuggestion(
                request.getText(),
                request.getStyle(),
                request.getAttitude()
        );

        ChatResponse response = ChatResponse.builder()
                .suggestion(suggestion)
                .style(request.getStyle())
                .attitude(request.getAttitude())
                .build();

        log.info("返回建议: {}", suggestion);

        return ResponseEntity.ok(response);
    }

    /**
     * 健康检查
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "version", "2.0.0-java",
                "features", new String[]{"chat", "speech_recognition"}
        ));
    }

    /**
     * 根路径
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
                "name", "实时对线助手 API (Java)",
                "version", "2.0.0-java",
                "endpoints", Map.of(
                        "chat", "/api/chat",
                        "speech", "/api/speech (WebSocket)",
                        "health", "/api/health"
                )
        ));
    }
}
