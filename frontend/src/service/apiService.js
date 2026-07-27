// ── REST API Service (Integrated with Spring Boot backend) ────────────────
const BASE_URL = 'http://localhost:8080/api'

// Helper to get the stored token
const getToken = () => localStorage.getItem('neochat_token')

// Helper for authenticated fetch
const authFetch = async (url, options = {}) => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  const response = await fetch(url, { ...options, headers })
  if (response.status === 401) {
    // Token expired — clear storage
    localStorage.removeItem('neochat_token')
    localStorage.removeItem('neochat_user')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }
  return response
}

export const apiService = {
  // ── Auth ──────────────────────────────────────────────────────────────
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || 'Login failed')
    }
    const data = await res.json()
    // Store token immediately so subsequent calls are authenticated
    if (data.token) localStorage.setItem('neochat_token', data.token)
    return {
      success: true,
      token: data.token,
      user: data.user,
    }
  },

  register: async (userName, email, password) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, email, password }),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || 'Registration failed')
    }
    const data = await res.json()
    if (data.token) localStorage.setItem('neochat_token', data.token)
    return {
      success: true,
      token: data.token,
      user: data.user,
    }
  },

  logout: async () => {
    try {
      await authFetch(`${BASE_URL}/auth/logout`, { method: 'POST' })
    } catch {
      // Proceed with local logout even if server call fails
    }
    localStorage.removeItem('neochat_token')
    localStorage.removeItem('neochat_user')
    return { success: true }
  },

  // ── Users ─────────────────────────────────────────────────────────────
  getUsers: async () => {
    const res = await authFetch(`${BASE_URL}/users`)
    if (!res.ok) return []
    const data = await res.json()
    // Map backend UserResponse { id, userName, online } to frontend shape
    return data.map(u => ({
      id:      u.id,
      name:    u.userName,
      initial: (u.userName || '?')[0].toUpperCase(),
      online:  u.online,
      time:    '',
      preview: '',
      unread:  0,
    }))
  },

  // ── Messages ──────────────────────────────────────────────────────────
  getHistory: async (userId) => {
    const res = await authFetch(`${BASE_URL}/messages/${userId}`)
    if (!res.ok) return []
    const data = await res.json()
    const myId = (() => {
      try { return JSON.parse(localStorage.getItem('neochat_user'))?.id } catch { return null }
    })()
    return data.map(m => ({
      id:     m.id,
      from:   m.senderId === myId ? 'me' : 'them',
      text:   m.content,
      time:   m.sentAt ? new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      status: m.status || null,
    }))
  },

  sendMessage: async (recipientId, content) => {
    const res = await authFetch(`${BASE_URL}/messages/send`, {
      method: 'POST',
      body: JSON.stringify({ recipientId, content }),
    })
    if (!res.ok) return { id: Date.now(), status: 'PENDING' }
    return await res.json()
  },

  // ── Profile ───────────────────────────────────────────────────────────
  updateProfile: async (userName, email) => {
    const res = await authFetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      body: JSON.stringify({ userName, email }),
    })
    if (!res.ok) throw new Error('Profile update failed')
    return await res.json()
  },

  changePassword: async (currentPassword, newPassword) => {
    const res = await authFetch(`${BASE_URL}/users/password`, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    if (!res.ok) throw new Error('Password change failed')
    return true
  },
}

// ── WebSocket Service (SockJS + STOMP) ───────────────────────────────────
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs.js'

let stompClient = null

export const wsService = {
  connect: (token, onMessage, onStatus, onPresence) => {
    if (stompClient?.active) return

    stompClient = new Client({
      webSocketFactory: () => new SockJS(`http://localhost:8080/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe('/user/queue/messages', (frame) => {
          try {
            const msg = JSON.parse(frame.body)
            if (onMessage) onMessage(msg)
          } catch { /* ignore parse errors */ }
        })
        stompClient.subscribe('/user/queue/status', (frame) => {
          try {
            const statusUpdate = JSON.parse(frame.body)
            if (onStatus) onStatus(statusUpdate)
          } catch { /* ignore */ }
        })
        stompClient.subscribe('/topic/presence', (frame) => {
          try {
            const presence = JSON.parse(frame.body)
            if (onPresence) onPresence(presence)
          } catch { /* ignore */ }
        })
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers?.message)
      },
    })

    stompClient.activate()
  },

  disconnect: () => {
    if (stompClient?.active) {
      stompClient.deactivate()
    }
    stompClient = null
  },

  sendMessage: (recipientId, content) => {
    if (!stompClient?.active) return
    stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ recipientId, content }),
    })
  },

  markDelivered: (messageId) => {
    if (!stompClient?.active) return
    stompClient.publish({
      destination: '/app/chat.delivered',
      body: JSON.stringify({ messageId }),
    })
  },

  markRead: (messageId) => {
    if (!stompClient?.active) return
    stompClient.publish({
      destination: '/app/chat.read',
      body: JSON.stringify({ messageId }),
    })
  },
}
