package com.chatApplication.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.chatApplication.backend.dto.MessageResponse;
import com.chatApplication.backend.dto.SendMessageRequest;
import com.chatApplication.backend.entity.Message;
import com.chatApplication.backend.entity.MessageStatus;
import com.chatApplication.backend.entity.User;
import com.chatApplication.backend.repository.MessageRepository;
import com.chatApplication.backend.repository.UserRepository;

@Service
public class MessageService {

  private final MessageRepository messageRepository;
  private final UserRepository userRepository;

  public MessageService(MessageRepository messageRepository,
                        UserRepository userRepository) {
    this.messageRepository = messageRepository;
    this.userRepository = userRepository;
  }

  public MessageResponse sendMessage(UUID senderId, SendMessageRequest request) {
    User sender = userRepository.findById(senderId)
        .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
    User recipient = userRepository.findById(request.getRecipientId())
        .orElseThrow(() -> new IllegalArgumentException("Recipient not found"));

    Message message = new Message();
    message.setContent(request.getContent());
    message.setSender(sender);
    message.setRecipient(recipient);
    message.setStatus(MessageStatus.PENDING);

    message = messageRepository.save(message);

    return toMessageResponse(message);
  }

  public List<MessageResponse> getConversation(UUID user1, UUID user2) {
    return messageRepository.findConversation(user1, user2).stream()
        .map(this::toMessageResponse)
        .toList();
  }

  public MessageResponse updateStatus(UUID messageId, MessageStatus status) {
    Message message = messageRepository.findById(messageId)
        .orElseThrow(() -> new IllegalArgumentException("Message not found"));
    message.setStatus(status);
    message = messageRepository.save(message);
    return toMessageResponse(message);
  }

  private MessageResponse toMessageResponse(Message message) {
    return new MessageResponse(
        message.getId(),
        message.getContent(),
        message.getSender().getId(),
        message.getRecipient().getId(),
        message.getTimeStamp(),
        message.getStatus());
  }
}
