package com.chatApplication.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chatApplication.backend.dto.ChangePasswordRequest;
import com.chatApplication.backend.dto.UserResponse;
import com.chatApplication.backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping
  public ResponseEntity<List<UserResponse>> getAllUsers(@AuthenticationPrincipal UUID userId) {
    if (userId == null) {
      return ResponseEntity.status(401).build();
    }
    return ResponseEntity.ok(userService.getAllUsers(userId));
  }

  @GetMapping("/{id}")
  public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
    try {
      return ResponseEntity.ok(userService.getUserById(id));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @PutMapping("/profile")
  public ResponseEntity<UserResponse> updateProfile(
      @AuthenticationPrincipal UUID userId,
      @RequestBody UpdateProfileRequest request) {
    if (userId == null) {
      return ResponseEntity.status(401).build();
    }
    try {
      return ResponseEntity.ok(
          userService.updateProfile(userId, request.getUserName(), request.getEmail()));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  @PutMapping("/password")
  public ResponseEntity<Void> changePassword(
      @AuthenticationPrincipal UUID userId,
      @Valid @RequestBody ChangePasswordRequest request) {
    if (userId == null) {
      return ResponseEntity.status(401).build();
    }
    try {
      userService.changePassword(userId, request);
      return ResponseEntity.ok().build();
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  // Inline DTO for profile update (no separate file needed for simplicity)
  public static class UpdateProfileRequest {
    private String userName;
    private String email;

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
  }
}
