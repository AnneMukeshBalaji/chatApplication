import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import UserList from '../../components/UserList'

const mockUsers = [
  { id: 1, name: 'Sara Williams', initial: 'S', online: true, time: '2m', preview: 'Hey!', unread: 2 },
  { id: 2, name: 'Marcus Chen', initial: 'M', online: false, time: '15m', preview: 'See you', unread: 0 },
]

describe('UserList', () => {
  it('renders all users', () => {
    const { unmount } = render(<UserList users={mockUsers} selectedId={null} onSelect={vi.fn()} />)
    expect(screen.getAllByText('Sara Williams').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Marcus Chen').length).toBeGreaterThanOrEqual(1)
    unmount()
  })

  it('renders the search input', () => {
    const { unmount } = render(<UserList users={mockUsers} selectedId={null} onSelect={vi.fn()} />)
    expect(screen.getAllByPlaceholderText('Search conversations...').length).toBeGreaterThanOrEqual(1)
    unmount()
  })

  it('filters users based on search input', () => {
    const { unmount } = render(<UserList users={mockUsers} selectedId={null} onSelect={vi.fn()} />)
    const searchInput = screen.getAllByPlaceholderText('Search conversations...')[0]
    fireEvent.change(searchInput, { target: { value: 'Sara' } })
    expect(screen.getAllByText('Sara Williams').length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText('Marcus Chen')).not.toBeInTheDocument()
    unmount()
  })

  it('shows unread count badge when unread > 0', () => {
    const { unmount } = render(<UserList users={mockUsers} selectedId={null} onSelect={vi.fn()} />)
    expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1)
    unmount()
  })

  it('calls onSelect when a user is clicked', () => {
    const onSelect = vi.fn()
    const { unmount } = render(<UserList users={mockUsers} selectedId={null} onSelect={onSelect} />)
    fireEvent.click(screen.getAllByText('Sara Williams')[0])
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 1, name: 'Sara Williams' }))
    unmount()
  })
})
