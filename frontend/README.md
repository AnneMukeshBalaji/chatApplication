# NeoChat — Frontend

Real-time messaging platform built with React and Vite, featuring a neumorphism UI design.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | UI library |
| Vite 8 | Build tool & dev server |
| React Router 7 | Client-side routing |
| oxlint | Linting |

## Project Structure

```
frontend/
├── public/              Static assets
├── src/
│   ├── components/      Reusable UI components
│   │   ├── Avatar.jsx         User avatar with online indicator
│   │   ├── ChatWindow.jsx     Message list with auto-scroll
│   │   ├── MessageBubble.jsx  Individual message display
│   │   ├── MessageInput.jsx   Text input with file attachments
│   │   ├── NeuButton.jsx      Neumorphism-styled button
│   │   ├── NeuInput.jsx       Neumorphism-styled input field
│   │   ├── Toast.jsx          Notification toast component
│   │   └── UserList.jsx       Contact list with search
│   ├── context/
│   │   └── AuthContext.jsx    Authentication state management
│   ├── pages/
│   │   ├── LoginPage.jsx      Login form
│   │   ├── RegisterPage.jsx   Registration form
│   │   ├── ChatPage.jsx       Main chat interface
│   │   └── ProfilePage.jsx    User profile & settings
│   ├── service/
│   │   └── apiService.js      REST API + WebSocket service layer
│   ├── styles/
│   │   └── neu.css            Neumorphism design system & responsive layout
│   ├── App.jsx                Root component with routing
│   ├── main.jsx               Application entry point
│   └── index.css              Global reset styles
├── index.html
├── package.json
└── vite.config.js
```

## Design

NeoChat uses a **neumorphism** (soft UI) design system with CSS custom properties. The color palette is defined in `neu.css` under `:root` and supports three screen sizes — desktop, tablet (768px), and mobile (600px).

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

```

## Dependencies

| Package | Version | Why |
|---------|---------|-----|
| react | ^19.2.7 | Core UI library |
| react-dom | ^19.2.7 | React DOM renderer |
| react-router-dom | ^7.18.0 | Client-side routing |

## Note

This is Phase 1 (frontend). API calls in `apiService.js` currently use mock data. Backend integration will be added in the next phase.
