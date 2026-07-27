import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProfilePage from '../../pages/ProfilePage'

// Mock apiService so no real HTTP calls are made during tests
vi.mock('../../service/apiService', () => ({
  apiService: {
    updateProfile:   vi.fn().mockResolvedValue({ userName: 'testuser', online: true }),
    changePassword:  vi.fn().mockResolvedValue(true),
  },
}))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { username: 'testuser', email: 'test@example.com', status: 'Available', avatarUrl: null, initial: 'T' },
    login:      vi.fn(),
    logout:     vi.fn(),
    updateUser: vi.fn(),
  }),
}))

describe('ProfilePage', () => {
  it('renders the My Profile heading', () => {
    render(<MemoryRouter><ProfilePage onClose={vi.fn()} /></MemoryRouter>)
    expect(screen.getByText('My Profile')).toBeInTheDocument()
  })

  it('renders profile info section', () => {
    render(<MemoryRouter><ProfilePage onClose={vi.fn()} /></MemoryRouter>)
    expect(screen.getByText('Profile Info')).toBeInTheDocument()
  })

  it('renders the Save Profile button', () => {
    render(<MemoryRouter><ProfilePage onClose={vi.fn()} /></MemoryRouter>)
    expect(screen.getByRole('button', { name: 'Save Profile' })).toBeInTheDocument()
  })

  it('renders the Change Password section', () => {
    render(<MemoryRouter><ProfilePage onClose={vi.fn()} /></MemoryRouter>)
    expect(screen.getByRole('button', { name: 'Change Password' })).toBeInTheDocument()
  })

  it('renders the Sign Out button', () => {
    render(<MemoryRouter><ProfilePage onClose={vi.fn()} /></MemoryRouter>)
    expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument()
  })
})
