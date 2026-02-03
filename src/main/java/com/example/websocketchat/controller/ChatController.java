package com.example.websocketchat.controller;

import com.example.websocketchat.model.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.time.LocalDateTime;
import java.util.Map;

@Controller
public class ChatController {
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public Message sendMessage(Message message) {
        if (message.getTimestamp() == null) {
            message.setTimestamp(LocalDateTime.now().toString());
        }
        return message;
    }
    @MessageMapping("/user.update")
    @SendTo("/topic/users")
    public Map<String, Object> handleUserUpdate(Map<String, Object> userUpdate) {
        return userUpdate;
    }
}