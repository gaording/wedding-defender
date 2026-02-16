package com.wedding.defender.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;

import lombok.extern.slf4j.Slf4j;

/**
 * 聊天服务 - 调用通义千问
 */
@Slf4j
@Service
public class ChatService {

    @Value("${dashscope.api-key}")
    private String apiKey;

    @Value("${dashscope.chat-url}")
    private String chatUrl;

    private static final Random RANDOM = new Random();

    // 风格描述
    private static final Map<String, StyleInfo> STYLE_PROMPTS = Map.of(
            "gentle", new StyleInfo("温和委婉，语气柔和", List.of("谢谢关心，我正在努力呢~", "您说得对，我会留意的~")),
            "humor", new StyleInfo("幽默风趣，轻松调侃", List.of("哈哈，要不您帮我介绍一个？", "我这不是在攒钱嘛~")),
            "rational", new StyleInfo("理性客观，讲道理", List.of("现在工作确实忙，想先稳定事业~", "我想遇到合适的人再结婚~"))
    );

    // 态度描述
    private static final Map<String, AttitudeInfo> ATTITUDE_PROMPTS = Map.of(
            "decline", new AttitudeInfo(
                    "委婉拒绝对方的催婚建议，表达自己的困难和想法",
                    "1. 先感谢对方的关心\n2. 说明自己的困难（工作忙、圈子小、没遇到合适的、经济压力等）\n3. 表明需要时间，不着急\n4. 语气委婉，不让对方难堪",
                    List.of(
                            "谢谢阿姨关心，我现在工作太忙了，实在没精力顾及这方面，等稳定些再说吧~",
                            "您说得对，但我周围圈子确实太小了，遇不到合适的，这事急不来~",
                            "我也想啊，但还没遇到聊得来的人，总不能随便找个人就结婚吧~"
                    )
            ),
            "accept", new AttitudeInfo(
                    "接受对方的建议，表示会考虑和行动",
                    "1. 感谢对方的建议和关心\n2. 认同对方说得有道理\n3. 表明会采取行动（会留意、会去相亲、会考虑介绍等）\n4. 态度积极，让对方放心",
                    List.of(
                            "谢谢阿姨提醒，您说得对，我最近确实该多出去认识认识人了~",
                            "好的，我会留意的，有合适的我也会主动接触~",
                            "您帮我留意一下也行，有机会我就去见见~"
                    )
            )
    );

    // 回退响应
    private static final Map<String, Map<String, List<String>>> FALLBACK_RESPONSES = Map.of(
            "decline", Map.of(
                    "gentle", List.of("谢谢阿姨关心，我现在工作太忙了，这事以后再说吧~", "我也想啊，但圈子太小了，遇不到合适的~"),
                    "humor", List.of("哈哈，我这不是在努力赚钱嘛，先立业再成家~", "要不您帮我物色物色？我这确实没渠道~"),
                    "rational", List.of("现在工作压力大，想先把事业稳定下来~", "我想遇到合适的人再结婚，不想将就~")
            ),
            "accept", Map.of(
                    "gentle", List.of("谢谢阿姨提醒，我最近会多留意这方面的~", "您说得对，我确实该主动一点了~"),
                    "humor", List.of("哈哈，那我最近多出去转转，看看能不能遇到~", "行，您帮我留意一下，有机会我就去见见~"),
                    "rational", List.of("您说得有道理，我最近确实在考虑这个问题~", "已经在看了，有合适的会主动接触~")
            )
    );

    /**
     * 获取建议回复
     */
    public String getSuggestion(String text, String style, String attitude) {
        if (apiKey == null || apiKey.isEmpty()) {
            log.warn("API Key 未配置，使用回退响应");
            return getFallbackResponse(style, attitude);
        }

        String prompt = buildPrompt(text, style, attitude);
        String result = callQwenApi(prompt);

        if (result == null || result.isEmpty()) {
            log.warn("API 调用失败，使用回退响应");
            return getFallbackResponse(style, attitude);
        }

        return result;
    }

    /**
     * 构建 Prompt
     */
    private String buildPrompt(String text, String style, String attitude) {
        StyleInfo styleInfo = STYLE_PROMPTS.getOrDefault(style, STYLE_PROMPTS.get("gentle"));
        AttitudeInfo attitudeInfo = ATTITUDE_PROMPTS.getOrDefault(attitude, ATTITUDE_PROMPTS.get("decline"));

        StringBuilder prompt = new StringBuilder();
        prompt.append("你是催婚应对顾问，帮用户给亲戚朋友一个得体的回复。\n\n");
        prompt.append("## 对方说\n").append("「").append(text).append("」\n\n");
        prompt.append("## 回复态度\n").append(attitudeInfo.desc).append("\n\n");
        prompt.append("回复结构：\n").append(attitudeInfo.structure).append("\n\n");
        prompt.append("## 表达风格\n").append(styleInfo.desc).append("\n\n");
        prompt.append("## 示例回复\n");
        for (String example : attitudeInfo.examples) {
            prompt.append("- ").append(example).append("\n");
        }
        prompt.append("\n## 要求\n");
        prompt.append("- 回复长度：25-50字\n");
        prompt.append("- 语气自然口语化\n");
        prompt.append("- 要有具体内容，不要空话\n\n");
        prompt.append("直接输出回复（不要引号）：");

        return prompt.toString();
    }

    /**
     * 调用通义千问 API
     */
    private String callQwenApi(String prompt) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost httpPost = new HttpPost(chatUrl);

            httpPost.setHeader("Authorization", "Bearer " + apiKey);
            httpPost.setHeader("Content-Type", "application/json");

            JSONObject requestBody = new JSONObject();
            requestBody.put("model", "qwen-plus");

            JSONArray messages = new JSONArray();
            JSONObject message = new JSONObject();
            message.put("role", "user");
            message.put("content", prompt);
            messages.add(message);
            requestBody.put("messages", messages);

            requestBody.put("max_tokens", 100);
            requestBody.put("temperature", 0.8);

            httpPost.setEntity(new StringEntity(requestBody.toJSONString(), ContentType.APPLICATION_JSON));

            try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                String responseBody = EntityUtils.toString(response.getEntity());

                if (response.getCode() != 200) {
                    log.error("Chat API error: {} - {}", response.getCode(), responseBody);
                    return null;
                }

                JSONObject jsonResponse = JSONObject.parseObject(responseBody);
                return jsonResponse.getJSONArray("choices")
                        .getJSONObject(0)
                        .getJSONObject("message")
                        .getString("content")
                        .trim();
            }
        } catch (Exception e) {
            log.error("调用通义千问 API 失败", e);
            return null;
        }
    }

    /**
     * 获取回退响应
     */
    private String getFallbackResponse(String style, String attitude) {
        Map<String, List<String>> attitudeResponses = FALLBACK_RESPONSES.getOrDefault(attitude, FALLBACK_RESPONSES.get("decline"));
        List<String> styleResponses = attitudeResponses.getOrDefault(style, attitudeResponses.get("gentle"));
        return styleResponses.get(RANDOM.nextInt(styleResponses.size()));
    }

    // 内部类
    private record StyleInfo(String desc, List<String> examples) {}
    private record AttitudeInfo(String desc, String structure, List<String> examples) {}
}
