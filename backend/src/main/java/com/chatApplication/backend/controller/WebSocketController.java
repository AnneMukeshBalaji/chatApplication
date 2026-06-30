package com.chatApplication.backend.controller;

import java.security.Principal;
import java.util.UUID;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.chatApplication.backend.dto.MessageResponse;
import com.chatApplication.backend.dto.SendMessageRequest;
import com.chatApplication.backend.entity.MessageStatus;
import com.chatApplication.backend.service.MessageService;

@Controller
public class WebSocketController {

  private final SimpMessagingTemplate messagingTemplate;
  private final MessageService messageService;

  public WebSocketController(SimpMessagingTemplate messagingTemplate,
                             MessageService messageService) {
    this.messagingTemplate = messagingTemplate;
    this.messageService = messageService;
  }

  @MessageMapping("/chat.send")
  public void sendMessage(@Payload SendMessageRequest request, Principal principal) {
    UUID senderId = UUID.fromString(principal.getName());
    MessageResponse response = messageService.sendMessage(senderId, request);

    messageService.updateStatus(response.getId(), MessageStatus.DELIVERED);
    response.setStatus(MessageStatus.DELIVERED);

    String recipientDestination = "/queue/messages/" + request.getRecipientId();
    messagingTemplate.convertAndSendToUser(
        request.getRecipientId().toString(),
        "/queue/messages",
        response
    );
  }

  @MessageMapping("/chat.typing")
  public void typing(@Payload TypingPayload payload, Principal principal) {
    messagingTemplate.convertAndSendToUser(
        payload.getRecipientId().toString(),
        "/queue/typing",
        new TypingPayload(UUID.fromString(principal.getName()), null)
    );
  }

  public static class TypingPayload {
    private UUID senderId;
    private UUID recipientId;

    public TypingPayload() {}

    public TypingPayload(UUID senderId, UUID recipientId) {
      this.senderId = senderId;
      this.recipientId = recipientId;
    }

    public UUID getSenderId() { return senderId; }
    public void setSenderId(UUID senderId) { this.senderId = senderId; }
    public UUID getRecipientId() { return recipientId; }
    public void setRecipientId(UUID recipientId) { this.recipientId = recipientId; }
  }
}
