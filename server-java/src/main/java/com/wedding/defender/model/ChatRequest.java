package com.wedding.defender.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 聊天请求
 */
@Data
public class ChatRequest {

    @NotBlank(message = "文本不能为空")
    @Size(min = 2, max = 500, message = "文本长度需在2-500字之间")
    private String text;

    private String style = "gentle";

    private String attitude = "decline";
}
