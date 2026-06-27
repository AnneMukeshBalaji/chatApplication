import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import RegisterPage from '../../pages/RegisterPage'

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

describe('RegisterPage', () => {
  it('renders the Create Account heading', () => {
    renderWithRouter(<RegisterPage />)
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument()
  })

  it('renders all four input fields', () => {
    renderWithRouter(<RegisterPage />)
    expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Create a password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Repeat your password')).toBeInTheDocument()
  })

  it('renders the Create Account button', () => {
    renderWithRouter(<RegisterPage />)
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
  })

  it('renders a link back to the login page', () => {
    renderWithRouter(<RegisterPage />)
    const link = screen.getByText('Sign In')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/login')
  })
})
