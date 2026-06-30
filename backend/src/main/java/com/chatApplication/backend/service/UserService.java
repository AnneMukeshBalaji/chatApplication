package com.chatApplication.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.chatApplication.backend.dto.ChangePasswordRequest;
import com.chatApplication.backend.dto.UserResponse;
import com.chatApplication.backend.entity.User;
import com.chatApplication.backend.repository.UserRepository;

@Service
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository,
                     PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public List<UserResponse> getAllUsers(UUID excludeUserId) {
    return userRepository.findAll().stream()
        .filter(u -> !u.getId().equals(excludeUserId))
        .map(u -> new UserResponse(u.getId(), u.getUserName(), u.isOnline()))
        .toList();
  }

  public UserResponse getUserById(UUID id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));
    return new UserResponse(user.getId(), user.getUserName(), user.isOnline());
  }

  public UserResponse updateProfile(UUID userId, String userName, String email) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));

    if (userName != null && !userName.isBlank()) {
      user.setUserName(userName);
    }
    if (email != null && !email.isBlank()) {
      user.setEmail(email);
    }

    user = userRepository.save(user);
    return new UserResponse(user.getId(), user.getUserName(), user.isOnline());
  }

  public void changePassword(UUID userId, ChangePasswordRequest request) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));

    if (!passwordEncoder.matches(request.getOldPassword(), user.getHashedPassword())) {
      throw new IllegalArgumentException("Current password is incorrect");
    }

    user.setHashedPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);
  }
}
