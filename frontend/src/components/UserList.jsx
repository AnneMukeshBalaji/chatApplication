import { useState } from 'react'
import Avatar from './Avatar'

export default function UserList({ users, selectedId, onSelect }) {
  const [search, setSearch] = useState('')
  const [focused, setFocused] = useState(false)

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: 16,
    }}>
      {/* Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'var(--surface)',
        borderRadius: 'var(--r-sm)',
        padding: '10px 14px',
        boxShadow: focused ? 'var(--neu-inset-sm), 0 0 0 2px var(--accent)' : 'var(--neu-inset-sm)',
        transition: 'box-shadow 0.2s ease',
      }}>
        <span style={{ color: 'var(--muted)', fontSize: 16 }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search conversations..."
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font)',
            fontSize: 14,
            color: 'var(--text)',
            width: '100%',
          }}
        />
      </div>

      {/* List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        {filtered.map(user => {
          const active = user.id === selectedId
          return (
            <button
              key={user.id}
              onClick={() => onSelect(user)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 14px',
                borderRadius: 'var(--r)',
                border: 'none',
                cursor: 'pointer',
                background: 'var(--surface)',
                fontFamily: 'var(--font)',
                textAlign: 'left',
                width: '100%',
                boxShadow: active ? 'var(--neu-inset)' : 'var(--neu-raised-sm)',
                transition: 'box-shadow 0.2s ease',
              }}
            >
              <Avatar initial={user.initial} size="md" online={user.online} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
                    {user.name}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--muted)', flexShrink: 0 }}>
                    {user.time}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 3 }}>
                  <span style={{
                    fontSize: 13,
                    color: 'var(--muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 160,
                  }}>
                    {user.preview}
                  </span>
                  {user.unread > 0 && (
                    <span style={{
                      background: 'var(--accent)',
                      color: '#fff',
                      borderRadius: 'var(--r-pill)',
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '2px 7px',
                      flexShrink: 0,
                    }}>
                      {user.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
