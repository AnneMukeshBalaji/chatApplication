/**
 * apiService Integration Tests
 * Tests that each API function calls the correct endpoint
 * with the correct method, headers, and body.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ── Mock fetch globally ────────────────────────────────────────────────────
const mockFetch = vi.fn()
global.fetch = mockFetch

// ── Mock localStorage ──────────────────────────────────────────────────────
const localStorageMock = (() => {
  let store = {}
  return {
    getItem:    (k) => store[k] ?? null,
    setItem:    (k, v) => { store[k] = String(v) },
    removeItem: (k) => { delete store[k] },
    clear:      () => { store = {} },
  }
})()
Object.defineProperty(global, 'localStorage', { value: localStorageMock })

// Mock SockJS + STOMP (WebSocket, not needed for REST tests)
vi.mock('@stomp/stompjs',     () => ({ Client: vi.fn() }))
vi.mock('sockjs-client/dist/sockjs.js', () => ({ default: vi.fn() }))

import { apiService } from '../../service/apiService'

// Helper: make fetch return a JSON response
const mockJsonResponse = (body, status = 200) => ({
  ok:     status >= 200 && status < 300,
  status,
  json:   async () => body,
  text:   async () => JSON.stringify(body),
})

describe('apiService — Authentication', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorageMock.clear()
  })

  it('login() POSTs to /api/auth/login with email and password', async () => {
    mockFetch.mockResolvedValueOnce(mockJsonResponse({
      token: 'jwt-abc123',
      user:  { id: 'uuid-1', userName: 'testuser', online: true },
    }))

    const result = await apiService.login('test@example.com', 'password123')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/login'),
      expect.objectContaining({
        method: 'POST',
        body:   JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      })
    )
    expect(result.success).toBe(true)
    expect(result.token).toBe('jwt-abc123')
    expect(result.user.userName).toBe('testuser')
  })

  it('login() stores the JWT token in localStorage', async () => {
    mockFetch.mockResolvedValueOnce(mockJsonResponse({
      token: 'stored-token',
      user:  { id: 'uuid-1', userName: 'luffy', online: true },
    }))

    await apiService.login('luffy@example.com', 'password123')
    expect(localStorageMock.getItem('neochat_token')).toBe('stored-token')
  })

  it('login() throws an error on non-OK response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 400, text: async () => 'Invalid email or password' })
    await expect(apiService.login('bad@email.com', 'wrong')).rejects.toThrow('Invalid email or password')
  })

  it('register() POSTs to /api/auth/register with userName, email, password', async () => {
    mockFetch.mockResolvedValueOnce(mockJsonResponse({
      token: 'jwt-register',
      user:  { id: 'uuid-2', userName: 'newuser', online: true },
    }))

    const result = await apiService.register('newuser', 'new@example.com', 'mypassword')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/register'),
      expect.objectContaining({
        method: 'POST',
        body:   JSON.stringify({ userName: 'newuser', email: 'new@example.com', password: 'mypassword' }),
      })
    )
    expect(result.success).toBe(true)
    expect(result.token).toBe('jwt-register')
  })

  it('register() throws on duplicate email/username', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 400, text: async () => 'Email already registered' })
    await expect(apiService.register('dup', 'dup@example.com', 'pass1234')).rejects.toThrow()
  })

  it('logout() POSTs to /api/auth/logout with Bearer token', async () => {
    localStorageMock.setItem('neochat_token', 'my-token')
    mockFetch.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({}) })

    await apiService.logout()

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/logout'),
      expect.objectContaining({ method: 'POST' })
    )
    // Token should be cleared after logout
    expect(localStorageMock.getItem('neochat_token')).toBeNull()
  })
})

describe('apiService — Users', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorageMock.setItem('neochat_token', 'test-jwt-token')
  })

  it('getUsers() GETs /api/users with Authorization header', async () => {
    mockFetch.mockResolvedValueOnce(mockJsonResponse([
      { id: 'uuid-1', userName: 'Alice', online: true },
      { id: 'uuid-2', userName: 'Bob',   online: false },
    ]))

    const users = await apiService.getUsers()

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/users'),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-jwt-token' }),
      })
    )
    expect(users).toHaveLength(2)
    expect(users[0].name).toBe('Alice')
    expect(users[0].online).toBe(true)
    expect(users[1].name).toBe('Bob')
  })

  it('getUsers() maps backend fields to frontend shape', async () => {
    mockFetch.mockResolvedValueOnce(mockJsonResponse([
      { id: 'uuid-3', userName: 'Charlie', online: true },
    ]))

    const users = await apiService.getUsers()
    expect(users[0]).toMatchObject({ name: 'Charlie', initial: 'C', online: true, unread: 0 })
  })

  it('getUsers() returns empty array on non-auth error (403/500)', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 403, json: async () => ({}) })
    const result = await apiService.getUsers()
    expect(result).toEqual([])
  })

  it('getUsers() throws Unauthorized on 401 (triggers redirect)', async () => {
    // Suppress window.location.href assignment in jsdom
    delete window.location
    window.location = { href: '' }
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({}) })
    await expect(apiService.getUsers()).rejects.toThrow('Unauthorized')
  })
})

describe('apiService — Messages', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorageMock.setItem('neochat_token', 'test-jwt-token')
    localStorageMock.setItem('neochat_user', JSON.stringify({ id: 'my-uuid' }))
  })

  it('sendMessage() POSTs to /api/messages/send with recipientId and content', async () => {
    mockFetch.mockResolvedValueOnce(mockJsonResponse({ id: 'msg-1', status: 'PENDING' }))

    const result = await apiService.sendMessage('recipient-uuid', 'Hello there!')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/messages/send'),
      expect.objectContaining({
        method: 'POST',
        body:   JSON.stringify({ recipientId: 'recipient-uuid', content: 'Hello there!' }),
      })
    )
    expect(result.id).toBe('msg-1')
  })

  it('getHistory() GETs /api/messages/{userId}', async () => {
    mockFetch.mockResolvedValueOnce(mockJsonResponse([
      { id: 'msg-1', senderId: 'other-uuid', content: 'Hey!',   sentAt: '2026-07-27T10:00:00Z', status: 'READ' },
      { id: 'msg-2', senderId: 'my-uuid',    content: 'Hello!', sentAt: '2026-07-27T10:01:00Z', status: 'DELIVERED' },
    ]))

    const history = await apiService.getHistory('other-uuid')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/messages/other-uuid'),
      expect.anything()
    )
    expect(history).toHaveLength(2)
    expect(history[0].from).toBe('them')  // senderId !== myId
    expect(history[1].from).toBe('me')    // senderId === myId
    expect(history[0].text).toBe('Hey!')
  })

  it('getHistory() returns empty array on error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 403, json: async () => ({}) })
    const result = await apiService.getHistory('bad-id')
    expect(result).toEqual([])
  })
})

describe('apiService — Profile', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorageMock.setItem('neochat_token', 'test-jwt-token')
  })

  it('updateProfile() PUTs to /api/users/profile', async () => {
    mockFetch.mockResolvedValueOnce(mockJsonResponse({ id: 'u1', userName: 'newname', online: true }))

    const result = await apiService.updateProfile('newname', 'new@email.com')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/users/profile'),
      expect.objectContaining({
        method: 'PUT',
        body:   JSON.stringify({ userName: 'newname', email: 'new@email.com' }),
      })
    )
    expect(result.userName).toBe('newname')
  })

  it('changePassword() PUTs to /api/users/password', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({}) })

    await apiService.changePassword('oldPass', 'newPass123')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/users/password'),
      expect.objectContaining({
        method: 'PUT',
        body:   JSON.stringify({ currentPassword: 'oldPass', newPassword: 'newPass123' }),
      })
    )
  })

  it('changePassword() throws on failure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 400, json: async () => ({}) })
    await expect(apiService.changePassword('wrong', 'newpass')).rejects.toThrow('Password change failed')
  })
})
