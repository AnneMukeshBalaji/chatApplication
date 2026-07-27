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
import org.springframework.security.crypto.password.PasswordEncoder;

import com.chatApplication.backend.dto.ChangePasswordRequest;
import com.chatApplication.backend.dto.UserResponse;
import com.chatApplication.backend.entity.User;
import com.chatApplication.backend.repository.UserRepository;

/**
 * Unit Tests for UserService
 * Tests: getAllUsers, getUserById, updateProfile, changePassword
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Unit Tests")
class UserServiceTest {

    @Mock private UserRepository  userRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User userAlice;
    private User userBob;

    private final UUID aliceId = UUID.randomUUID();
    private final UUID bobId   = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        userAlice = new User();
        userAlice.setId(aliceId);
        userAlice.setUserName("alice");
        userAlice.setEmail("alice@example.com");
        userAlice.setHashedPassword("$2a$10$hashedAlice");
        userAlice.setOnline(true);

        userBob = new User();
        userBob.setId(bobId);
        userBob.setUserName("bob");
        userBob.setEmail("bob@example.com");
        userBob.setHashedPassword("$2a$10$hashedBob");
        userBob.setOnline(false);
    }

    // ── GET ALL USERS ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("getAllUsers() - excludes the requesting user from list")
    void getAllUsers_ExcludesCurrentUser() {
        when(userRepository.findAll()).thenReturn(List.of(userAlice, userBob));

        List<UserResponse> result = userService.getAllUsers(aliceId);

        assertEquals(1, result.size());
        assertEquals("bob", result.get(0).getUserName());
        assertFalse(result.stream().anyMatch(u -> u.getUserName().equals("alice")));
    }

    @Test
    @DisplayName("getAllUsers() - returns all other users with correct online status")
    void getAllUsers_MapsOnlineStatusCorrectly() {
        when(userRepository.findAll()).thenReturn(List.of(userAlice, userBob));

        List<UserResponse> result = userService.getAllUsers(aliceId);

        assertEquals(1, result.size());
        assertEquals(bobId, result.get(0).getId());
        assertFalse(result.get(0).isOnline()); // bob is offline
    }

    @Test
    @DisplayName("getAllUsers() - returns empty list when only current user exists")
    void getAllUsers_OnlyCurrentUser_ReturnsEmpty() {
        when(userRepository.findAll()).thenReturn(List.of(userAlice));

        List<UserResponse> result = userService.getAllUsers(aliceId);

        assertTrue(result.isEmpty());
    }

    // ── GET USER BY ID ────────────────────────────────────────────────────────

    @Test
    @DisplayName("getUserById() - returns user when found")
    void getUserById_Success() {
        when(userRepository.findById(aliceId)).thenReturn(Optional.of(userAlice));

        UserResponse response = userService.getUserById(aliceId);

        assertEquals(aliceId, response.getId());
        assertEquals("alice", response.getUserName());
        assertTrue(response.isOnline());
    }

    @Test
    @DisplayName("getUserById() - throws when user not found")
    void getUserById_NotFound_ThrowsException() {
        UUID unknownId = UUID.randomUUID();
        when(userRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
            () -> userService.getUserById(unknownId));
    }

    // ── UPDATE PROFILE ────────────────────────────────────────────────────────

    @Test
    @DisplayName("updateProfile() - updates username and email successfully")
    void updateProfile_UpdatesBothFields() {
        User updatedUser = new User();
        updatedUser.setId(aliceId);
        updatedUser.setUserName("alice_updated");
        updatedUser.setEmail("newalice@example.com");
        updatedUser.setOnline(true);

        when(userRepository.findById(aliceId)).thenReturn(Optional.of(userAlice));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        UserResponse response = userService.updateProfile(aliceId, "alice_updated", "newalice@example.com");

        assertEquals("alice_updated", response.getUserName());
        verify(userRepository).save(userAlice);
    }

    @Test
    @DisplayName("updateProfile() - ignores blank username (keeps existing)")
    void updateProfile_BlankUsername_KeepsExisting() {
        when(userRepository.findById(aliceId)).thenReturn(Optional.of(userAlice));
        when(userRepository.save(any(User.class))).thenReturn(userAlice);

        userService.updateProfile(aliceId, "  ", "newalice@example.com");

        assertEquals("alice", userAlice.getUserName()); // unchanged
        verify(userRepository).save(userAlice);
    }

    @Test
    @DisplayName("updateProfile() - throws when user not found")
    void updateProfile_UserNotFound_ThrowsException() {
        UUID unknownId = UUID.randomUUID();
        when(userRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
            () -> userService.updateProfile(unknownId, "newname", "new@email.com"));
    }

    // ── CHANGE PASSWORD ───────────────────────────────────────────────────────

    @Test
    @DisplayName("changePassword() - succeeds with correct current password")
    void changePassword_Success() {
        ChangePasswordRequest request = new ChangePasswordRequest("oldPass123", "newPass456");

        when(userRepository.findById(aliceId)).thenReturn(Optional.of(userAlice));
        when(passwordEncoder.matches("oldPass123", "$2a$10$hashedAlice")).thenReturn(true);
        when(passwordEncoder.encode("newPass456")).thenReturn("$2a$10$hashedNewPass");

        assertDoesNotThrow(() -> userService.changePassword(aliceId, request));
        verify(userRepository).save(userAlice);
        assertEquals("$2a$10$hashedNewPass", userAlice.getHashedPassword());
    }

    @Test
    @DisplayName("changePassword() - throws when current password is wrong")
    void changePassword_WrongCurrentPassword_ThrowsException() {
        ChangePasswordRequest request = new ChangePasswordRequest("wrongOldPass", "newPass456");

        when(userRepository.findById(aliceId)).thenReturn(Optional.of(userAlice));
        when(passwordEncoder.matches("wrongOldPass", "$2a$10$hashedAlice")).thenReturn(false);

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> userService.changePassword(aliceId, request)
        );
        assertEquals("Current password is incorrect", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("changePassword() - throws when user not found")
    void changePassword_UserNotFound_ThrowsException() {
        UUID unknownId = UUID.randomUUID();
        when(userRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
            () -> userService.changePassword(unknownId, new ChangePasswordRequest("old", "new12345")));
    }
}
