import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MessageBubble from '../../components/MessageBubble'

describe('MessageBubble', () => {
  it('renders a sent message with text', () => {
    render(<MessageBubble message={{ id: 1, from: 'me', text: 'Hello!', time: '10:00 AM', status: 'DELIVERED' }} />)
    expect(screen.getByText('Hello!')).toBeInTheDocument()
    expect(screen.getByText('10:00 AM')).toBeInTheDocument()
  })

  it('renders a received message with text', () => {
    render(<MessageBubble message={{ id: 2, from: 'them', text: 'Hi!', time: '10:02 AM', status: null }} />)
    expect(screen.getByText('Hi!')).toBeInTheDocument()
  })

  it('shows READ status for sent messages', () => {
    render(<MessageBubble message={{ id: 3, from: 'me', text: 'Hey', time: '10:05 AM', status: 'READ' }} />)
    expect(screen.getByTitle('Read')).toBeInTheDocument()
  })

  it('shows PENDING status for sent messages', () => {
    render(<MessageBubble message={{ id: 4, from: 'me', text: 'Wait', time: '10:06 AM', status: 'PENDING' }} />)
    expect(screen.getByTitle('Pending')).toBeInTheDocument()
  })

  it('renders nothing for empty messages', () => {
    const { container } = render(<MessageBubble message={{ id: 5, from: 'me', text: '', time: '10:07 AM', status: null }} />)
    expect(container.innerHTML).toBe('')
  })
})
