import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from '../../pages/LoginPage'

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: null,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}))

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('LoginPage', () => {
  it('renders the NeoChat heading', () => {
    renderWithRouter(<LoginPage />)
    expect(screen.getByText('NeoChat')).toBeInTheDocument()
  })

  it('renders the welcome back subtitle', () => {
    renderWithRouter(<LoginPage />)
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
  })

  it('renders email and password input fields', () => {
    renderWithRouter(<LoginPage />)
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
  })

  it('renders the Sign In button', () => {
    renderWithRouter(<LoginPage />)
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  it('renders a link to the register page', () => {
    renderWithRouter(<LoginPage />)
    const link = screen.getByText('Register')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/register')
  })
})
