import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiService } from '../service/apiService'
import NeuInput  from '../components/NeuInput'
import NeuButton from '../components/NeuButton'
import Toast     from '../components/Toast'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [toast,    setToast]    = useState(null)

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setToast({ message: 'Please fill in all fields', type: 'error' })
      return
    }
    if (password !== confirm) {
      setToast({ message: 'Passwords do not match', type: 'error' })
      return
    }
    setLoading(true)
    try {
      const res = await apiService.register(username, email, password)
      if (res.success) {
        login(res.user, res.token)
        navigate('/chat')
      } else {
        setToast({ message: 'Registration failed', type: 'error' })
      }
    } catch (err) {
      setToast({ message: err.message || 'Registration failed. Try a different username or email.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleRegister()
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '24px 16px',
    }}>
      <div
        className="auth-card"
        style={{
          width: '100%',
          maxWidth: 400,
          padding: '48px 40px',
          borderRadius: 24,
          background: 'var(--surface)',
          boxShadow: 'var(--neu-raised)',
        }}
        onKeyDown={handleKeyDown}
      >
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 72, height: 72,
            borderRadius: 24,
            background: 'var(--accent)',
            boxShadow: '6px 6px 16px rgba(108,99,255,0.4), -4px -4px 10px #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            margin: '0 auto 16px',
          }}>
            💬
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', margin: 0 }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>
            Join NeoChat today
          </p>
        </div>

        <NeuInput
          label="Username"
          id="username"
          placeholder="Choose a username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <NeuInput
          label="Email"
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <NeuInput
          label="Password"
          id="password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <NeuInput
          label="Confirm Password"
          id="confirm"
          type="password"
          placeholder="Repeat your password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />

        <div style={{ marginTop: 8 }}>
          <NeuButton onClick={handleRegister} variant="primary">
            {loading ? 'Creating account…' : 'Create Account'}
          </NeuButton>
        </div>

        <p style={{
          textAlign: 'center',
          marginTop: 24,
          fontSize: 14,
          color: 'var(--muted)',
          fontFamily: 'var(--font)',
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
