package com.chatApplication.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chatApplication.backend.dto.AuthResponse;
import com.chatApplication.backend.dto.LoginRequest;
import com.chatApplication.backend.dto.RegisterRequest;
import com.chatApplication.backend.service.AuthService;

import jakarta.validation.Valid;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    try {
      AuthResponse response = authService.register(request);
      return ResponseEntity.ok(response);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    try {
      AuthResponse response = authService.login(request);
      return ResponseEntity.ok(response);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout(@AuthenticationPrincipal UUID userId) {
    if (userId != null) {
      authService.logout(userId);
    }
    return ResponseEntity.ok().build();
  }
}
