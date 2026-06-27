package com.chatApplication.backend.security;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Service
public class JwtService {
  @Value("${app.jwt.secret}")
  private String secretString;
  @Value("${app.jwt.expiration-ms}")
  private long expirationMs;
  private SecretKey secretKey;

  @PostConstruct
  public void init(){
    byte [] keyBytes = Decoders.BASE64.decode(secretString);
    this.secretKey = Keys.hmacShaKeyFor(keyBytes);
  }
}
