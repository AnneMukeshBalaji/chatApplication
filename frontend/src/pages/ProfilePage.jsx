import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Avatar    from '../components/Avatar'
import NeuInput  from '../components/NeuInput'
import NeuButton from '../components/NeuButton'
import Toast     from '../components/Toast'

export default function ProfilePage({ onClose }) {
  const { currentUser, login, logout } = useAuth()
  const navigate = useNavigate()

  const [username,   setUsername]   = useState(currentUser?.username || '')
  const [email,      setEmail]      = useState(currentUser?.email    || '')
  const [status,     setStatus]     = useState(currentUser?.status   || 'Available')
  const [avatarUrl,  setAvatarUrl]  = useState(currentUser?.avatarUrl || null)
  const [oldPass,    setOldPass]    = useState('')
  const [newPass,    setNewPass]    = useState('')
  const [confirmPass,setConfirmPass]= useState('')
  const [toast,      setToast]      = useState(null)
  const [saving,     setSaving]     = useState(false)
  const fileRef = useRef(null)

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarUrl(URL.createObjectURL(file))
  }

  const handleSaveProfile = async () => {
    if (!username.trim() || !email.trim()) {
      setToast({ message: 'Username and email are required', type: 'error' })
      return
    }
    setSaving(true)
    try {
      login({ ...currentUser, username, email, status, avatarUrl,
        initial: username[0].toUpperCase() })
      setToast({ message: 'Profile updated!', type: 'success' })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      setToast({ message: 'Fill in all password fields', type: 'error' })
      return
    }
    if (newPass !== confirmPass) {
      setToast({ message: 'New passwords do not match', type: 'error' })
      return
    }
    if (newPass.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' })
      return
    }
    setSaving(true)
    try {
      setOldPass(''); setNewPass(''); setConfirmPass('')
      setToast({ message: 'Password changed!', type: 'success' })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sectionLabel = (text) => (
    <p style={{
      fontSize: 11, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.7px',
      color: 'var(--muted)', margin: '24px 0 12px',
    }}>
      {text}
    </p>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.15)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Panel */}
      <div
        className="profile-panel"
        style={{
          position: 'relative',
          width: 360,
          height: '100%',
          background: 'var(--surface)',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
          padding: '32px 28px 28px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 20, right: 20,
            width: 36, height: 36, borderRadius: '50%',
            border: 'none', background: 'var(--surface)',
            cursor: 'pointer', fontSize: 18,
            boxShadow: 'var(--neu-raised-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >✕</button>

        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 24 }}>
          My Profile
        </h2>

        {/* Avatar picker */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => fileRef.current.click()}>
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" style={{
                  width: 88, height: 88, borderRadius: 28,
                  objectFit: 'cover',
                  boxShadow: 'var(--neu-raised)',
                }} />
              : <Avatar initial={username[0]?.toUpperCase() || '?'} size="xl" accent />
            }
            <div style={{
              position: 'absolute', bottom: -4, right: -4,
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--accent)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, boxShadow: 'var(--neu-raised-sm)',
              cursor: 'pointer',
            }}>✏️</div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10 }}>
            Click avatar to change photo
          </p>
        </div>

        {sectionLabel('Profile Info')}
        <NeuInput label="Username" id="username" placeholder="Username"
          value={username} onChange={e => setUsername(e.target.value)} />
        <NeuInput label="Email" id="email" type="email" placeholder="Email"
          value={email} onChange={e => setEmail(e.target.value)} />
        <NeuInput label="Status Message" id="status" placeholder="What's on your mind?"
          value={status} onChange={e => setStatus(e.target.value)} />

        <NeuButton onClick={handleSaveProfile} variant="primary">
          {saving ? 'Saving…' : 'Save Profile'}
        </NeuButton>

        {sectionLabel('Change Password')}
        <NeuInput label="Current Password" id="oldPass" type="password" placeholder="Current password"
          value={oldPass} onChange={e => setOldPass(e.target.value)} />
        <NeuInput label="New Password" id="newPass" type="password" placeholder="New password"
          value={newPass} onChange={e => setNewPass(e.target.value)} />
        <NeuInput label="Confirm New Password" id="confirmPass" type="password" placeholder="Repeat new password"
          value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />

        <NeuButton onClick={handleChangePassword} variant="outline">
          {saving ? 'Updating…' : 'Change Password'}
        </NeuButton>

        {sectionLabel('Account')}
        <NeuButton onClick={handleLogout} variant="danger">
          Sign Out
        </NeuButton>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
