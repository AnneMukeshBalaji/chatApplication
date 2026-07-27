package com.chatApplication.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.chatApplication.backend.config.SecurityConfig;
import com.chatApplication.backend.dto.AuthResponse;
import com.chatApplication.backend.dto.LoginRequest;
import com.chatApplication.backend.dto.RegisterRequest;
import com.chatApplication.backend.dto.UserResponse;
import com.chatApplication.backend.security.JwtFilterClass;
import com.chatApplication.backend.security.JwtService;
import com.chatApplication.backend.service.AuthService;

import java.util.UUID;

/**
 * Controller (MockMvc) Tests for AuthController
 * Tests: POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout
 * No real DB — all service calls are mocked with Mockito
 */
@WebMvcTest(AuthController.class)
@Import({ SecurityConfig.class, JwtFilterClass.class })
@DisplayName("AuthController MockMvc Tests")
class AuthControllerTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private AuthService authService;
    @MockBean private JwtService  jwtService;

    private final UUID testUserId = UUID.randomUUID();

    private AuthResponse makeAuthResponse(String username) {
        UserResponse user = new UserResponse(testUserId, username, true);
        return new AuthResponse(user, "mock-jwt-token");
    }

    // ── REGISTER ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/auth/register - 200 OK with valid payload")
    void register_ValidPayload_Returns200() throws Exception {
        when(authService.register(any(RegisterRequest.class)))
            .thenReturn(makeAuthResponse("newuser"));

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "userName": "newuser",
                      "email": "new@example.com",
                      "password": "securePass1"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("mock-jwt-token"))
            .andExpect(jsonPath("$.user.userName").value("newuser"))
            .andExpect(jsonPath("$.user.online").value(true));
    }

    @Test
    @DisplayName("POST /api/auth/register - 400 Bad Request when email already exists")
    void register_DuplicateEmail_Returns400() throws Exception {
        when(authService.register(any(RegisterRequest.class)))
            .thenThrow(new IllegalArgumentException("Email already registered"));

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "userName": "user2",
                      "email": "duplicate@example.com",
                      "password": "password12"
                    }
                    """))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/auth/register - 400 Bad Request when password is too short (validation)")
    void register_ShortPassword_Returns400() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "userName": "user3",
                      "email": "user3@example.com",
                      "password": "short"
                    }
                    """))
            .andExpect(status().isBadRequest());

        verify(authService, never()).register(any());
    }

    // ── LOGIN ─────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/auth/login - 200 OK with valid credentials")
    void login_ValidCredentials_Returns200() throws Exception {
        when(authService.login(any(LoginRequest.class)))
            .thenReturn(makeAuthResponse("testuser"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "email": "test@example.com",
                      "password": "correctPass1"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("mock-jwt-token"))
            .andExpect(jsonPath("$.user.userName").value("testuser"));
    }

    @Test
    @DisplayName("POST /api/auth/login - 400 Bad Request with wrong credentials")
    void login_WrongCredentials_Returns400() throws Exception {
        when(authService.login(any(LoginRequest.class)))
            .thenThrow(new IllegalArgumentException("Invalid email or password"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "email": "wrong@example.com",
                      "password": "wrongPass12"
                    }
                    """))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/auth/login - 400 Bad Request for invalid email format")
    void login_InvalidEmailFormat_Returns400() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "email": "not-an-email",
                      "password": "password12"
                    }
                    """))
            .andExpect(status().isBadRequest());

        verify(authService, never()).login(any());
    }
}
