import { useState } from 'react'

const base = {
  border: 'none',
  borderRadius: 'var(--r-pill)',
  fontFamily: 'var(--font)',
  fontSize: 15,
  fontWeight: 700,
  cursor: 'pointer',
  padding: '14px 24px',
  width: '100%',
  transition: 'box-shadow 0.2s ease, transform 0.2s ease, background 0.2s ease, color 0.2s ease',
}

const variants = {
  primary: {
    background: 'var(--accent)',
    color: '#fff',
    boxShadow: '4px 4px 12px rgba(108,99,255,0.4), -2px -2px 6px #ffffff',
  },
  outline: {
    background: 'var(--surface)',
    color: 'var(--accent)',
    border: '2px solid var(--accent)',
    boxShadow: 'var(--neu-raised-sm)',
  },
  danger: {
    background: 'var(--surface)',
    color: 'var(--danger)',
    boxShadow: 'var(--neu-raised-sm)',
  },
}

const hoverVariants = {
  primary: { boxShadow: '6px 6px 16px rgba(108,99,255,0.5), -3px -3px 8px #ffffff' },
  outline: { background: 'var(--accent)', color: '#fff' },
  danger:  { background: 'var(--danger)', color: '#fff', boxShadow: '4px 4px 12px rgba(255,107,138,0.35), -2px -2px 6px #fff' },
}

export default function NeuButton({ children, onClick, variant = 'primary', style = {} }) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const pressedStyle = pressed ? { boxShadow: 'inset 3px 3px 8px rgba(0,0,0,0.15)', transform: 'scale(0.98)' } : {}

  return (
    <button
      style={{ ...base, ...variants[variant], ...(hovered ? hoverVariants[variant] : {}), ...pressedStyle, ...style }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      {children}
    </button>
  )
}
