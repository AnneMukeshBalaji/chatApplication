package com.chatApplication.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.chatApplication.backend.entity.MessageStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
  private UUID id;
  private String content;
  private UUID senderId;
  private UUID recipientId;
  private LocalDateTime timeStamp;
  private MessageStatus status;
}
