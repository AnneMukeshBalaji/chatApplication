package com.chatApplication.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.chatApplication.backend.dto.MessageResponse;
import com.chatApplication.backend.dto.SendMessageRequest;
import com.chatApplication.backend.entity.Message;
import com.chatApplication.backend.entity.MessageStatus;
import com.chatApplication.backend.entity.User;
import com.chatApplication.backend.repository.MessageRepository;
import com.chatApplication.backend.repository.UserRepository;

/**
 * Unit Tests for MessageService
 * Tests: sendMessage, getConversation, updateStatus
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("MessageService Unit Tests")
class MessageServiceTest {

    @Mock private MessageRepository messageRepository;
    @Mock private UserRepository    userRepository;

    @InjectMocks
    private MessageService messageService;

    private User sender;
    private User recipient;
    private Message testMessage;

    private final UUID senderId    = UUID.randomUUID();
    private final UUID recipientId = UUID.randomUUID();
    private final UUID messageId   = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        sender = new User();
        sender.setId(senderId);
        sender.setUserName("alice");
        sender.setEmail("alice@example.com");
        sender.setOnline(true);

        recipient = new User();
        recipient.setId(recipientId);
        recipient.setUserName("bob");
        recipient.setEmail("bob@example.com");
        recipient.setOnline(true);

        testMessage = new Message();
        testMessage.setId(messageId);
        testMessage.setContent("Hello Bob!");
        testMessage.setSender(sender);
        testMessage.setRecipient(recipient);
        testMessage.setStatus(MessageStatus.PENDING);
    }

    // ── SEND MESSAGE ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("sendMessage() - success: message saved with PENDING status")
    void sendMessage_Success() {
        SendMessageRequest request = new SendMessageRequest();
        request.setRecipientId(recipientId);
        request.setContent("Hello Bob!");

        when(userRepository.findById(senderId)).thenReturn(Optional.of(sender));
        when(userRepository.findById(recipientId)).thenReturn(Optional.of(recipient));
        when(messageRepository.save(any(Message.class))).thenReturn(testMessage);

        MessageResponse response = messageService.sendMessage(senderId, request);

        assertNotNull(response);
        assertEquals("Hello Bob!", response.getContent());
        assertEquals(senderId, response.getSenderId());
        assertEquals(recipientId, response.getRecipientId());
        assertEquals(MessageStatus.PENDING, response.getStatus());
        verify(messageRepository).save(any(Message.class));
    }

    @Test
    @DisplayName("sendMessage() - throws when sender not found")
    void sendMessage_SenderNotFound_ThrowsException() {
        SendMessageRequest request = new SendMessageRequest();
        request.setRecipientId(recipientId);
        request.setContent("test");

        when(userRepository.findById(senderId)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> messageService.sendMessage(senderId, request)
        );
        assertEquals("Sender not found", ex.getMessage());
        verify(messageRepository, never()).save(any());
    }

    @Test
    @DisplayName("sendMessage() - throws when recipient not found")
    void sendMessage_RecipientNotFound_ThrowsException() {
        SendMessageRequest request = new SendMessageRequest();
        request.setRecipientId(recipientId);
        request.setContent("test");

        when(userRepository.findById(senderId)).thenReturn(Optional.of(sender));
        when(userRepository.findById(recipientId)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> messageService.sendMessage(senderId, request)
        );
        assertEquals("Recipient not found", ex.getMessage());
    }

    // ── GET CONVERSATION ──────────────────────────────────────────────────────

    @Test
    @DisplayName("getConversation() - returns messages between two users in order")
    void getConversation_ReturnsMessages() {
        Message msg2 = new Message();
        msg2.setId(UUID.randomUUID());
        msg2.setContent("Hey Alice!");
        msg2.setSender(recipient);
        msg2.setRecipient(sender);
        msg2.setStatus(MessageStatus.READ);

        when(messageRepository.findConversation(senderId, recipientId))
            .thenReturn(List.of(testMessage, msg2));

        List<MessageResponse> conversation = messageService.getConversation(senderId, recipientId);

        assertEquals(2, conversation.size());
        assertEquals("Hello Bob!", conversation.get(0).getContent());
        assertEquals("Hey Alice!", conversation.get(1).getContent());
    }

    @Test
    @DisplayName("getConversation() - returns empty list when no messages exist")
    void getConversation_NoMessages_ReturnsEmptyList() {
        when(messageRepository.findConversation(senderId, recipientId))
            .thenReturn(List.of());

        List<MessageResponse> result = messageService.getConversation(senderId, recipientId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    // ── UPDATE STATUS ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("updateStatus() - changes PENDING to DELIVERED")
    void updateStatus_PendingToDelivered() {
        Message updatedMessage = new Message();
        updatedMessage.setId(messageId);
        updatedMessage.setContent("Hello Bob!");
        updatedMessage.setSender(sender);
        updatedMessage.setRecipient(recipient);
        updatedMessage.setStatus(MessageStatus.DELIVERED);

        when(messageRepository.findById(messageId)).thenReturn(Optional.of(testMessage));
        when(messageRepository.save(any(Message.class))).thenReturn(updatedMessage);

        MessageResponse response = messageService.updateStatus(messageId, MessageStatus.DELIVERED);

        assertEquals(MessageStatus.DELIVERED, response.getStatus());
        verify(messageRepository).save(testMessage);
    }

    @Test
    @DisplayName("updateStatus() - changes DELIVERED to READ")
    void updateStatus_DeliveredToRead() {
        testMessage.setStatus(MessageStatus.DELIVERED);
        Message readMessage = new Message();
        readMessage.setId(messageId);
        readMessage.setContent("Hello Bob!");
        readMessage.setSender(sender);
        readMessage.setRecipient(recipient);
        readMessage.setStatus(MessageStatus.READ);

        when(messageRepository.findById(messageId)).thenReturn(Optional.of(testMessage));
        when(messageRepository.save(any(Message.class))).thenReturn(readMessage);

        MessageResponse response = messageService.updateStatus(messageId, MessageStatus.READ);

        assertEquals(MessageStatus.READ, response.getStatus());
    }

    @Test
    @DisplayName("updateStatus() - throws when message not found")
    void updateStatus_MessageNotFound_ThrowsException() {
        UUID unknownId = UUID.randomUUID();
        when(messageRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertThrows(
            IllegalArgumentException.class,
            () -> messageService.updateStatus(unknownId, MessageStatus.READ)
        );
    }
}
