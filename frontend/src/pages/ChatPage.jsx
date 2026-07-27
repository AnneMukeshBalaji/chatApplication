import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiService, wsService } from '../service/apiService'
import UserList    from '../components/UserList'
import ChatWindow  from '../components/ChatWindow'
import MessageInput from '../components/MessageInput'
import Avatar      from '../components/Avatar'
import Toast       from '../components/Toast'
import ProfilePage from './ProfilePage'

export default function ChatPage() {
  const { currentUser, token } = useAuth()
  const navigate = useNavigate()

  const [users,       setUsers]       = useState([])
  const [selected,    setSelected]    = useState(null)
  const [messages,    setMessages]    = useState(null)
  const [typing,      setTyping]      = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [toast,       setToast]       = useState(null)
  const [mobileShowChat, setMobileShowChat] = useState(false)

  const selectedRef = useRef(selected)
  useEffect(() => { selectedRef.current = selected }, [selected])

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) navigate('/login')
  }, [currentUser, navigate])

  // Load users from real backend
  useEffect(() => {
    if (!currentUser) return
    apiService.getUsers().then(setUsers).catch(() => {
      setToast({ message: 'Failed to load contacts', type: 'error' })
    })
  }, [currentUser])

  // Connect WebSocket when we have a token
  useEffect(() => {
    if (!token) return

    wsService.connect(
      token,
      // onMessage: incoming real-time message
      (msg) => {
        const myId = currentUser?.id
        const incomingMsg = {
          id:     msg.id,
          from:   msg.senderId === myId ? 'me' : 'them',
          text:   msg.content,
          time:   new Date(msg.sentAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: msg.status || null,
        }

        // Update messages if this conversation is currently open
        if (selectedRef.current?.id === msg.senderId || selectedRef.current?.id === msg.recipientId) {
          setMessages(prev => [...(prev || []), incomingMsg])
        }

        // Update user list preview
        setUsers(prev => prev.map(u =>
          u.id === msg.senderId
            ? { ...u, preview: msg.content, time: 'now', unread: (selectedRef.current?.id === u.id) ? 0 : (u.unread || 0) + 1 }
            : u
        ))
      },
      // onStatus: message status updates
      (statusUpdate) => {
        setMessages(prev => prev?.map(m =>
          m.id === statusUpdate.messageId ? { ...m, status: statusUpdate.status } : m
        ))
      },
      // onPresence: user online/offline
      (presence) => {
        setUsers(prev => prev.map(u =>
          u.id === presence.userId ? { ...u, online: presence.online } : u
        ))
      }
    )

    return () => {
      wsService.disconnect()
    }
  }, [token, currentUser])

  const handleSelectUser = async (user) => {
    setSelected(user)
    try {
      const history = await apiService.getHistory(user.id)
      setMessages(history)
    } catch {
      setMessages([])
      setToast({ message: 'Could not load conversation history', type: 'error' })
    }
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, unread: 0 } : u))
    setMobileShowChat(true)
  }

  const handleBack = () => {
    setMobileShowChat(false)
    setSelected(null)
    setMessages(null)
  }

  const handleSend = async (text, files = []) => {
    if (!selected) return

    const attachments = files.map(f => ({
      name: f.name,
      type: f.type,
      url:  f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
    }))

    const tempId = `temp-${Date.now()}`
    const tempMsg = {
      id:     tempId,
      from:   'me',
      text,
      time:   new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING',
      attachments,
    }

    setMessages(prev => [...(prev || []), tempMsg])
    setUsers(prev => prev.map(u =>
      u.id === selected.id ? { ...u, preview: text, time: 'now' } : u
    ))

    try {
      // Try WebSocket first (faster), fall back to REST
      if (wsService && token) {
        wsService.sendMessage(selected.id, text)
      } else {
        await apiService.sendMessage(selected.id, text)
      }

      setTimeout(() => {
        setMessages(prev => prev?.map(m =>
          m.id === tempId ? { ...m, status: 'DELIVERED' } : m
        ))
      }, 800)
    } catch {
      setMessages(prev => prev?.map(m =>
        m.id === tempId ? { ...m, status: 'FAILED' } : m
      ))
      setToast({ message: 'Failed to send message', type: 'error' })
    }
  }

  if (!currentUser) return null

  return (
    <div className="chat-layout">
      {/* ── Sidebar ── */}
      <div className={`chat-sidebar${mobileShowChat ? ' hidden-mobile' : ''}`}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 4px',
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>
            NeoChat
          </h2>
          <button
            onClick={() => setShowProfile(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <Avatar initial={currentUser.initial} size="sm" online={true} />
          </button>
        </div>

        {/* User list */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <UserList
            users={users}
            selectedId={selected?.id}
            onSelect={handleSelectUser}
          />
        </div>
      </div>

      {/* ── Chat area ── */}
      <div className="chat-main">
        {selected ? (
          <>
            {/* Chat header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 20px',
              background: 'var(--surface)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              flexShrink: 0,
            }}>
              {/* Mobile back button */}
              <button className="mobile-back-btn" onClick={handleBack}>←</button>

              <Avatar initial={selected.initial} size="md" online={selected.online} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selected.name}
                </p>
                <p style={{ fontSize: 12, color: selected.online ? 'var(--green)' : 'var(--muted)' }}>
                  {selected.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <ChatWindow messages={messages} typing={typing} />

            {/* Input */}
            <div style={{ padding: '12px 16px 16px', flexShrink: 0 }}>
              <MessageInput onSend={handleSend} />
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--muted)',
            gap: 16,
          }}>
            <div style={{
              width: 80, height: 80,
              borderRadius: 28,
              background: 'var(--accent-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              boxShadow: 'var(--neu-raised)',
            }}>
              💬
            </div>
            <div style={{ textAlign: 'center', padding: '0 24px' }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                Welcome, {currentUser.username}!
              </p>
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>
                Select a conversation to start chatting.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Profile panel */}
      {showProfile && <ProfilePage onClose={() => setShowProfile(false)} />}

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
