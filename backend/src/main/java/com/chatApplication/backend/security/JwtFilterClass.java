package com.chatApplication.backend.security;

import java.io.IOException;
import java.util.UUID;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilterClass extends OncePerRequestFilter {

  private final JwtService jwtService;

  public JwtFilterClass(JwtService jwtService) {
    this.jwtService = jwtService;
  }

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain)
      throws ServletException, IOException {

    final String authHeader = request.getHeader("Authorization");

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      final String token = authHeader.substring(7);
      final UUID userId = jwtService.extractUserId(token);

      if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        UsernamePasswordAuthenticationToken authToken =
            new UsernamePasswordAuthenticationToken(
                userId, null, java.util.List.of());
        SecurityContextHolder.getContext().setAuthentication(authToken);
      }
    } catch (Exception e) {
      // Invalid token — leave SecurityContext empty, chain continues
      SecurityContextHolder.clearContext();
    }

    filterChain.doFilter(request, response);
  }
}
