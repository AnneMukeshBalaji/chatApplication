# NeoChat — Comprehensive Test Results Report

**Project Name:** NeoChat — Full-Stack Chat Application  
**Student Name:** Mukesh Balaji  
**Round:** Testing & Quality Assurance Round  
**Date:** 27-July-2026  
**Status:** ✅ ALL TESTS PASSED (82 / 82)

---

## 🏆 Overall Execution Summary

| Test Suite | Framework | Files / Classes | Total Tests | Passed | Failures | Duration |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **Frontend Suite** | Vitest v4.1.9 + RTL | 7 Files | 43 | 43 | 0 | 1.66s |
| **Backend Suite** | JUnit 5 + Mockito + MockMvc | 5 Classes | 39 | 39 | 0 | 50.40s |
| **TOTAL** | — | **12 Suites** | **82** | **82** | **0** | — |

---

## ☕ 1. Backend Testing Suite (39 Tests — Spring Boot / JUnit 5)

### Test Classes Breakdown

#### A. `AuthControllerTest.java` — MockMvc Web Layer Tests (6 Tests)
> Tests the REST controllers, endpoint security, payload validation, and HTTP status code mappings.

| # | Test Method | Description | Status |
|---|---|---|---|
| 1 | `register_ValidPayload_Returns200` | Verifies `POST /api/auth/register` returns 200 OK and JWT token | ✅ PASS |
| 2 | `register_DuplicateEmail_Returns400` | Verifies `POST /api/auth/register` handles duplicate email gracefully | ✅ PASS |
| 3 | `register_ShortPassword_Returns400` | Verifies Jakarta Validation triggers 400 Bad Request for short passwords | ✅ PASS |
| 4 | `login_ValidCredentials_Returns200` | Verifies `POST /api/auth/login` returns 200 OK and User payload | ✅ PASS |
| 5 | `login_WrongCredentials_Returns400` | Verifies bad credentials return 400 Bad Request | ✅ PASS |
| 6 | `login_InvalidEmailFormat_Returns400` | Verifies email format validation triggers 400 Bad Request | ✅ PASS |

---

#### B. `AuthServiceTest.java` — Service Layer Unit Tests (8 Tests)
> Tests user registration, authentication logic, BCrypt hashing, and JWT token issuance.

| # | Test Method | Description | Status |
|---|---|---|---|
| 1 | `register_Success` | Registers user, hashes password, saves entity, returns token | ✅ PASS |
| 2 | `register_DuplicateEmail_ThrowsException` | Throws exception when email already registered | ✅ PASS |
| 3 | `register_DuplicateUsername_ThrowsException` | Throws exception when username is already taken | ✅ PASS |
| 4 | `login_Success` | Validates password via BCrypt, marks user online, generates token | ✅ PASS |
| 5 | `login_WrongEmail_ThrowsException` | Throws exception on invalid email | ✅ PASS |
| 6 | `login_WrongPassword_ThrowsException` | Throws exception on incorrect password | ✅ PASS |
| 7 | `logout_SetsUserOffline` | Sets `isOnline` flag to `false` and saves user state | ✅ PASS |
| 8 | `logout_UnknownUser_DoesNothing` | Safely handles non-existent user logout without crashing | ✅ PASS |

---

#### C. `MessageServiceTest.java` — Messaging & Status Tests (8 Tests)
> Tests direct messaging, message status transitions (`PENDING` → `DELIVERED` → `READ`), and conversation history.

| # | Test Method | Description | Status |
|---|---|---|---|
| 1 | `sendMessage_Success` | Saves message with `PENDING` status and maps response | ✅ PASS |
| 2 | `sendMessage_SenderNotFound_ThrowsException` | Throws exception when sender UUID does not exist | ✅ PASS |
| 3 | `sendMessage_RecipientNotFound_ThrowsException` | Throws exception when recipient UUID does not exist | ✅ PASS |
| 4 | `getConversation_ReturnsMessages` | Retrieves chronologically ordered chat messages between two users | ✅ PASS |
| 5 | `getConversation_NoMessages_ReturnsEmptyList` | Returns empty array when no message history exists | ✅ PASS |
| 6 | `updateStatus_PendingToDelivered` | Updates status from `PENDING` to `DELIVERED` | ✅ PASS |
| 7 | `updateStatus_DeliveredToRead` | Updates status from `DELIVERED` to `READ` | ✅ PASS |
| 8 | `updateStatus_MessageNotFound_ThrowsException` | Throws exception for invalid message UUID | ✅ PASS |

---

#### D. `UserServiceTest.java` — User Profile & Management Tests (11 Tests)
> Tests user lookup, contact listing, profile updates, and password changes.

| # | Test Method | Description | Status |
|---|---|---|---|
| 1 | `getAllUsers_ExcludesCurrentUser` | Excludes the logged-in user from contact list | ✅ PASS |
| 2 | `getAllUsers_MapsOnlineStatusCorrectly` | Maps online/offline status correctly for each user | ✅ PASS |
| 3 | `getAllUsers_OnlyCurrentUser_ReturnsEmpty` | Returns empty list when no other users exist | ✅ PASS |
| 4 | `getUserById_Success` | Fetches single user by UUID | ✅ PASS |
| 5 | `getUserById_NotFound_ThrowsException` | Throws exception when user UUID is missing | ✅ PASS |
| 6 | `updateProfile_UpdatesBothFields` | Updates username and email successfully | ✅ PASS |
| 7 | `updateProfile_BlankUsername_KeepsExisting` | Ignores blank input and preserves existing username | ✅ PASS |
| 8 | `updateProfile_UserNotFound_ThrowsException` | Throws exception when updating unknown user | ✅ PASS |
| 9 | `changePassword_Success` | Encodes new password when old password matches | ✅ PASS |
| 10 | `changePassword_WrongCurrentPassword_ThrowsException` | Rejects change if current password is wrong | ✅ PASS |
| 11 | `changePassword_UserNotFound_ThrowsException` | Throws exception if user is missing | ✅ PASS |

---

#### E. `JwtServiceTest.java` — Security & Cryptography Unit Tests (5 Tests)
> Tests HMAC-SHA256 JWT token generation, parsing, expiration validation, and tamper detection.

| # | Test Method | Description | Status |
|---|---|---|---|
| 1 | `generateToken_ReturnsValidToken` | Generates structured 3-part JWT token string | ✅ PASS |
| 2 | `generateToken_DifferentUserIds_ProduceDifferentTokens` | Ensures unique tokens for different user UUIDs | ✅ PASS |
| 3 | `extractUserId_RoundTrip` | Verifies exact UUID extraction from signed JWT | ✅ PASS |
| 4 | `extractUserId_MultipleTokens_EachCorrect` | Stress tests round-trip token creation and parsing | ✅ PASS |
| 5 | `extractUserId_TamperedToken_ThrowsException` | Rejects tokens with modified signatures | ✅ PASS |

---

#### F. `BackendApplicationTests.java` — Spring Boot Context Integration (1 Test)
| # | Test Method | Description | Status |
|---|---|---|---|
| 1 | `contextLoads` | Boots full Spring Context, JPA Repositories, Security & WebSockets | ✅ PASS |

---

## ⚛️ 2. Frontend Testing Suite (43 Tests — Vitest + RTL)

| Test File | Tests | Description | Status |
|---|:---:|---|:---:|
| `apiService.test.js` | 16 | Real REST API integration, fetch headers, JWT storage | ✅ PASS |
| `LoginPage.test.jsx` | 5 | UI render, form inputs, submission handlers | ✅ PASS |
| `RegisterPage.test.jsx` | 4 | Account creation UI and field validations | ✅ PASS |
| `ChatPage.test.jsx` | 3 | Authentication guard and real-time state | ✅ PASS |
| `ProfilePage.test.jsx` | 5 | Profile info, password update, logout flow | ✅ PASS |
| `UserList.test.jsx` | 5 | Contact searching, selection, unread badges | ✅ PASS |
| `MessageBubble.test.jsx` | 5 | Sent/Received bubbles, time format, status icons | ✅ PASS |

---

## 🛠️ How to Run Tests Locally

### Run Backend Tests:
```bash
cd backend
./mvnw test
```

### Run Frontend Tests:
```bash
cd frontend
npm test
```

---

*Report generated automatically for BlackBucks Internship Submission.*  
*Candidate: Mukesh Balaji*
