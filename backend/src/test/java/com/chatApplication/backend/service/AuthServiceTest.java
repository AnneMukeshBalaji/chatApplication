package com.chatApplication.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

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

import com.chatApplication.backend.dto.AuthResponse;
import com.chatApplication.backend.dto.LoginRequest;
import com.chatApplication.backend.dto.RegisterRequest;
import com.chatApplication.backend.entity.User;
import com.chatApplication.backend.repository.UserRepository;
import com.chatApplication.backend.security.JwtService;

/**
 * Unit Tests for AuthService
 * Tests: register, login, logout — using Mockito to isolate from DB
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock private UserRepository   userRepository;
    @Mock private PasswordEncoder  passwordEncoder;
    @Mock private JwtService       jwtService;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private final UUID testUserId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(testUserId);
        testUser.setUserName("testuser");
        testUser.setEmail("test@example.com");
        testUser.setHashedPassword("$2a$10$hashedPassword");
        testUser.setOnline(false);
    }

    // ── REGISTER ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("register() - success: new user is saved and JWT is returned")
    void register_Success() {
        RegisterRequest request = new RegisterRequest("testuser", "securePass1", "test@example.com");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(userRepository.findByUserName("testuser")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("securePass1")).thenReturn("$2a$10$hashed");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateToken(testUserId)).thenReturn("jwt-token-123");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("jwt-token-123", response.getToken());
        assertEquals("testuser", response.getUser().getUserName());
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("register() - fails when email already exists")
    void register_DuplicateEmail_ThrowsException() {
        RegisterRequest request = new RegisterRequest("newuser", "password1", "test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> authService.register(request)
        );
        assertEquals("Email already registered", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("register() - fails when username already taken")
    void register_DuplicateUsername_ThrowsException() {
        RegisterRequest request = new RegisterRequest("testuser", "password1", "other@example.com");
        when(userRepository.findByEmail("other@example.com")).thenReturn(Optional.empty());
        when(userRepository.findByUserName("testuser")).thenReturn(Optional.of(testUser));

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> authService.register(request)
        );
        assertEquals("Username already taken", ex.getMessage());
    }

    // ── LOGIN ─────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("login() - success: valid credentials return user + JWT")
    void login_Success() {
        LoginRequest request = new LoginRequest("test@example.com", "correctPass");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("correctPass", "$2a$10$hashedPassword")).thenReturn(true);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateToken(testUserId)).thenReturn("jwt-login-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt-login-token", response.getToken());
        assertEquals("testuser", response.getUser().getUserName());
        assertTrue(response.getUser().isOnline());
    }

    @Test
    @DisplayName("login() - fails with wrong email")
    void login_WrongEmail_ThrowsException() {
        LoginRequest request = new LoginRequest("wrong@example.com", "anyPass");
        when(userRepository.findByEmail("wrong@example.com")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> authService.login(request));
    }

    @Test
    @DisplayName("login() - fails with wrong password")
    void login_WrongPassword_ThrowsException() {
        LoginRequest request = new LoginRequest("test@example.com", "wrongPass");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPass", "$2a$10$hashedPassword")).thenReturn(false);

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> authService.login(request)
        );
        assertEquals("Invalid email or password", ex.getMessage());
    }

    // ── LOGOUT ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("logout() - sets user offline and saves")
    void logout_SetsUserOffline() {
        testUser.setOnline(true);
        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));

        authService.logout(testUserId);

        assertFalse(testUser.isOnline());
        verify(userRepository).save(testUser);
    }

    @Test
    @DisplayName("logout() - does nothing for unknown userId")
    void logout_UnknownUser_DoesNothing() {
        UUID unknownId = UUID.randomUUID();
        when(userRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> authService.logout(unknownId));
        verify(userRepository, never()).save(any());
    }
}
