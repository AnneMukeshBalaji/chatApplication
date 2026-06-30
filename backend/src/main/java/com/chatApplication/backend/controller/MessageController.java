package com.chatApplication.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chatApplication.backend.dto.MessageResponse;
import com.chatApplication.backend.dto.SendMessageRequest;
import com.chatApplication.backend.entity.MessageStatus;
import com.chatApplication.backend.service.MessageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

  private final MessageService messageService;

  public MessageController(MessageService messageService) {
    this.messageService = messageService;
  }

  @PostMapping("/send")
  public ResponseEntity<MessageResponse> sendMessage(
      @AuthenticationPrincipal UUID userId,
      @Valid @RequestBody SendMessageRequest request) {
    if (userId == null) {
      return ResponseEntity.status(401).build();
    }
    try {
      return ResponseEntity.ok(messageService.sendMessage(userId, request));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  @GetMapping("/{userId}")
  public ResponseEntity<List<MessageResponse>> getConversation(
      @AuthenticationPrincipal UUID currentUserId,
      @PathVariable UUID userId) {
    if (currentUserId == null) {
      return ResponseEntity.status(401).build();
    }
    return ResponseEntity.ok(messageService.getConversation(currentUserId, userId));
  }

  @PutMapping("/{messageId}/status")
  public ResponseEntity<MessageResponse> updateStatus(
      @PathVariable UUID messageId,
      @RequestBody UpdateStatusRequest request) {
    try {
      return ResponseEntity.ok(
          messageService.updateStatus(messageId, request.getStatus()));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  public static class UpdateStatusRequest {
    private MessageStatus status;

    public MessageStatus getStatus() { return status; }
    public void setStatus(MessageStatus status) { this.status = status; }
  }
}
