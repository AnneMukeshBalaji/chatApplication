package com.chatApplication.backend.security;

import static org.junit.jupiter.api.Assertions.*;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

/**
 * Unit Tests for JwtService
 * Tests: token generation and extraction without Spring context
 */
@DisplayName("JwtService Unit Tests")
class JwtServiceTest {

    private JwtService jwtService;

    // Same base64 secret as in application.yml
    private static final String TEST_SECRET =
        "bG9yZC1zaXZhLWlzLXRoZS1raW5nLWhlLXdpbGwtc2F2ZS15b3UtZnJvbS1hbGwta2luZHMtb2YtZGFuZ2Vy";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretString", TEST_SECRET);
        ReflectionTestUtils.setField(jwtService, "expirationMs", 86400000L);
        jwtService.init();
    }

    @Test
    @DisplayName("generateToken() - returns non-null, non-empty token for a UUID")
    void generateToken_ReturnsValidToken() {
        UUID userId = UUID.randomUUID();

        String token = jwtService.generateToken(userId);

        assertNotNull(token);
        assertFalse(token.isBlank());
        // JWT format: three base64 parts separated by dots
        assertEquals(3, token.split("\\.").length);
    }

    @Test
    @DisplayName("generateToken() - different UUIDs produce different tokens")
    void generateToken_DifferentUserIds_ProduceDifferentTokens() {
        UUID user1 = UUID.randomUUID();
        UUID user2 = UUID.randomUUID();

        String token1 = jwtService.generateToken(user1);
        String token2 = jwtService.generateToken(user2);

        assertNotEquals(token1, token2);
    }

    @Test
    @DisplayName("extractUserId() - correctly extracts the UUID from generated token")
    void extractUserId_RoundTrip() {
        UUID originalId = UUID.randomUUID();

        String token      = jwtService.generateToken(originalId);
        UUID   extractedId = jwtService.extractUserId(token);

        assertEquals(originalId, extractedId);
    }

    @Test
    @DisplayName("extractUserId() - same UUID survives generate → extract round-trip")
    void extractUserId_MultipleTokens_EachCorrect() {
        for (int i = 0; i < 5; i++) {
            UUID id    = UUID.randomUUID();
            String tok = jwtService.generateToken(id);
            assertEquals(id, jwtService.extractUserId(tok));
        }
    }

    @Test
    @DisplayName("extractUserId() - throws exception for tampered token")
    void extractUserId_TamperedToken_ThrowsException() {
        UUID userId = UUID.randomUUID();
        String token = jwtService.generateToken(userId);

        // Tamper with the signature part
        String tamperedToken = token.substring(0, token.lastIndexOf('.') + 1) + "invalidsignature";

        assertThrows(Exception.class, () -> jwtService.extractUserId(tamperedToken));
    }
}
