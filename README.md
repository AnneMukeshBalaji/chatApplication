# NeoChat — Full-Stack Chat Application

A real-time chat application built with **React (Vite)** frontend and **Spring Boot** backend, integrated via REST API and WebSocket (SockJS + STOMP).

---

## Tech Stack

| Layer     | Technology |
|-----------|-----------|
| Frontend  | React 19, Vite, React Router v7 |
| Backend   | Spring Boot 4.1, Spring Security, Spring WebSocket |
| Database  | PostgreSQL |
| Auth      | JWT (jjwt 0.12.6) |
| Real-time | SockJS + STOMP (`@stomp/stompjs`) |

---

## Project Structure

```
chatApplication/
├── backend/          # Spring Boot (Maven)
│   └── src/main/java/com/chatApplication/backend/
│       ├── controller/   # AuthController, MessageController, UserController, WebSocketController
│       ├── service/      # AuthService, MessageService, UserService
│       ├── entity/       # User, Message, MessageStatus
│       ├── repository/   # UserRepository, MessageRepository
│       ├── security/     # JwtService, JwtFilterClass
│       ├── config/       # SecurityConfig (CORS + JWT filter), WebSocketConfig
│       └── dto/          # Request/Response DTOs
└── frontend/         # React + Vite
    └── src/
        ├── context/      # AuthContext (JWT token + user persistence)
        ├── service/      # apiService.js (REST), wsService (WebSocket)
        ├── pages/        # LoginPage, RegisterPage, ChatPage, ProfilePage
        ├── components/   # UserList, ChatWindow, MessageInput, Avatar, etc.
        └── styles/       # Neumorphic CSS design system
```

---

## Integration Points

### 1. REST API (Frontend → Backend)

| Frontend Call | Backend Endpoint | Method |
|---|---|---|
| `apiService.login()` | `/api/auth/login` | POST |
| `apiService.register()` | `/api/auth/register` | POST |
| `apiService.logout()` | `/api/auth/logout` | POST |
| `apiService.getUsers()` | `/api/users` | GET |
| `apiService.getHistory(userId)` | `/api/messages/{userId}` | GET |
| `apiService.sendMessage()` | `/api/messages/send` | POST |
| `apiService.updateProfile()` | `/api/users/profile` | PUT |
| `apiService.changePassword()` | `/api/users/password` | PUT |

### 2. WebSocket (Real-time Messaging)
- Endpoint: `ws://localhost:8080/ws` (via SockJS)
- Protocol: STOMP
- Auth: JWT token in connect headers
- Subscriptions:
  - `/user/queue/messages` — incoming private messages
  - `/user/queue/status` — message delivery/read receipts
  - `/topic/presence` — user online/offline events

### 3. JWT Authentication Flow
1. Login/Register → backend returns JWT token
2. Token stored in `localStorage` (`neochat_token`)
3. All API requests send `Authorization: Bearer <token>` header
4. WebSocket connects with token in STOMP connect headers

### 4. CORS Configuration
- Backend allows requests from `http://localhost:5173` (Vite dev server)
- Vite dev server proxies `/api` and `/ws` to `http://localhost:8080`

---

## Running the Application

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL running locally

### 1. Setup Database
```sql
CREATE DATABASE chat_application;
CREATE USER luffy WITH PASSWORD 'luffy';
GRANT ALL PRIVILEGES ON DATABASE chat_application TO luffy;
```

### 2. Start Backend
```bash
cd backend
./mvnw spring-boot:run
# Backend starts on http://localhost:8080
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend starts on http://localhost:5173
```

### 4. Open Application
Navigate to `http://localhost:5173` in your browser.

---

## API Documentation

### Auth Endpoints (Public)
```
POST /api/auth/register
Body: { "userName": "string", "email": "string", "password": "string" }
Response: { "user": { "id": "uuid", "userName": "string", "online": bool }, "token": "jwt-string" }

POST /api/auth/login
Body: { "email": "string", "password": "string" }
Response: { "user": { "id": "uuid", "userName": "string", "online": bool }, "token": "jwt-string" }

POST /api/auth/logout
Headers: Authorization: Bearer <token>
```

### User Endpoints (Authenticated)
```
GET  /api/users              — List all users (excluding current)
GET  /api/users/{id}         — Get user by ID
PUT  /api/users/profile      — Update profile { userName, email }
PUT  /api/users/password     — Change password { currentPassword, newPassword }
```

### Message Endpoints (Authenticated)
```
POST /api/messages/send      — Send message { recipientId, content }
GET  /api/messages/{userId}  — Get conversation history with user
PUT  /api/messages/{id}/status — Update message status { status: "DELIVERED"|"READ" }
```

---

*Submitted for BlackBucks Internship — Integration Round*
