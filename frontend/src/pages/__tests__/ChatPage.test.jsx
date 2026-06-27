import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../../service/apiService', () => ({
  apiService: {
    getUsers: vi.fn().mockResolvedValue([
      { id: 1, name: 'Sara', initial: 'S', online: true, time: '2m', preview: 'Hey!', unread: 0 },
    ]),
    getHistory: vi.fn().mockResolvedValue([]),
    sendMessage: vi.fn().mockResolvedValue({ id: 1, status: 'PENDING' }),
  },
  wsService: { connect: vi.fn(), disconnect: vi.fn(), sendMessage: vi.fn(), markDelivered: vi.fn(), markRead: vi.fn() },
}))

describe('ChatPage', () => {
  beforeEach(() => { vi.resetModules(); mockNavigate.mockClear() })

  it('redirects to /login when no user is authenticated', async () => {
    vi.doMock('../../context/AuthContext', () => ({
      useAuth: () => ({ currentUser: null, login: vi.fn(), logout: vi.fn() }),
      AuthProvider: ({ children }) => children,
    }))
    const { default: ChatPageFresh } = await import('../../pages/ChatPage')
    await act(async () => {
      render(<MemoryRouter initialEntries={['/chat']}><ChatPageFresh /></MemoryRouter>)
    })
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('renders NeoChat heading when authenticated', async () => {
    vi.doMock('../../context/AuthContext', () => ({
      useAuth: () => ({ currentUser: { username: 'testuser', initial: 'T' }, login: vi.fn(), logout: vi.fn() }),
      AuthProvider: ({ children }) => children,
    }))
    const { default: ChatPageFresh } = await import('../../pages/ChatPage')
    await act(async () => {
      render(<MemoryRouter initialEntries={['/chat']}><ChatPageFresh /></MemoryRouter>)
    })
    expect(screen.getByText('NeoChat')).toBeInTheDocument()
  })

  it('shows welcome message with username', async () => {
    vi.doMock('../../context/AuthContext', () => ({
      useAuth: () => ({ currentUser: { username: 'testuser', initial: 'T' }, login: vi.fn(), logout: vi.fn() }),
      AuthProvider: ({ children }) => children,
    }))
    const { default: ChatPageFresh } = await import('../../pages/ChatPage')
    await act(async () => {
      render(<MemoryRouter initialEntries={['/chat']}><ChatPageFresh /></MemoryRouter>)
    })
    expect(screen.getByText(/Welcome, testuser!/)).toBeInTheDocument()
  })
})
