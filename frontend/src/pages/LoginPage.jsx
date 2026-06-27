import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiService } from '../service/apiService'
import NeuInput  from '../components/NeuInput'
import NeuButton from '../components/NeuButton'
import Toast     from '../components/Toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [toast,    setToast]    = useState(null)

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setToast({ message: 'Please fill in all fields', type: 'error' })
      return
    }
    setLoading(true)
    try {
      const res = await apiService.login(email, password)
      if (res.success) {
        login(res.user.username)
        navigate('/chat')
      } else {
        setToast({ message: 'Invalid credentials', type: 'error' })
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
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
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
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
            NeoChat
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>
            Welcome back
          </p>
        </div>

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
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <div style={{ marginTop: 8 }}>
          <NeuButton onClick={handleLogin} variant="primary">
            {loading ? 'Signing in…' : 'Sign In'}
          </NeuButton>
        </div>

        <p style={{
          textAlign: 'center',
          marginTop: 24,
          fontSize: 14,
          color: 'var(--muted)',
          fontFamily: 'var(--font)',
        }}>
          No account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
            Register
          </Link>
        </p>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
