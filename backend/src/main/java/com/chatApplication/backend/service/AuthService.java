package com.chatApplication.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

import com.chatApplication.backend.dto.AuthResponse;
import com.chatApplication.backend.dto.LoginRequest;
import com.chatApplication.backend.dto.RegisterRequest;
import com.chatApplication.backend.dto.UserResponse;
import com.chatApplication.backend.entity.User;
import com.chatApplication.backend.repository.UserRepository;
import com.chatApplication.backend.security.JwtService;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(UserRepository userRepository,
                     PasswordEncoder passwordEncoder,
                     JwtService jwtService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  public AuthResponse register(RegisterRequest request) {
    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
      throw new IllegalArgumentException("Email already registered");
    }

    if (userRepository.findByUserName(request.getUserName()).isPresent()) {
      throw new IllegalArgumentException("Username already taken");
    }

    User user = new User();
    user.setUserName(request.getUserName());
    user.setEmail(request.getEmail());
    user.setHashedPassword(passwordEncoder.encode(request.getPassword()));
    user.setOnline(true);

    user = userRepository.save(user);

    String token = jwtService.generateToken(user.getId());

    return new AuthResponse(
        new UserResponse(user.getId(), user.getUserName(), user.isOnline()),
        token);
  }

  public AuthResponse login(LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

    if (!passwordEncoder.matches(request.getPassword(), user.getHashedPassword())) {
      throw new IllegalArgumentException("Invalid email or password");
    }

    user.setOnline(true);
    userRepository.save(user);

    String token = jwtService.generateToken(user.getId());

    return new AuthResponse(
        new UserResponse(user.getId(), user.getUserName(), user.isOnline()),
        token);
  }

  public void logout(UUID userId) {
    userRepository.findById(userId).ifPresent(user -> {
      user.setOnline(false);
      userRepository.save(user);
    });
  }
}
