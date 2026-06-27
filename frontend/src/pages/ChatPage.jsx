import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiService } from '../service/apiService'
import UserList    from '../components/UserList'
import ChatWindow  from '../components/ChatWindow'
import MessageInput from '../components/MessageInput'
import Avatar      from '../components/Avatar'
import Toast       from '../components/Toast'
import ProfilePage from './ProfilePage'

export default function ChatPage() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [users,       setUsers]       = useState([])
  const [selected,    setSelected]    = useState(null)
  const [messages,    setMessages]    = useState(null)
  const [typing,      setTyping]      = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [toast,       setToast]       = useState(null)
  // mobile: whether to show chat panel (vs sidebar)
  const [mobileShowChat, setMobileShowChat] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) navigate('/login')
  }, [currentUser, navigate])

  // Load users
  useEffect(() => {
    apiService.getUsers().then(setUsers)
  }, [])

  const handleSelectUser = async (user) => {
    setSelected(user)
    const history = await apiService.getHistory(user.id)
    setMessages(history)
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, unread: 0 } : u))
    setTimeout(() => setTyping(true),  1500)
    setTimeout(() => setTyping(false), 4000)
    // On mobile, slide to chat view
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

    const tempMsg = {
      id:     Date.now(),
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

    await apiService.sendMessage(selected.id, text)

    setTimeout(() => {
      setMessages(prev => prev.map(m =>
        m.id === tempMsg.id ? { ...m, status: 'DELIVERED' } : m
      ))
    }, 800)

    setTimeout(() => {
      setMessages(prev => prev.map(m =>
        m.id === tempMsg.id ? { ...m, status: 'READ' } : m
      ))
    }, 2200)
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
