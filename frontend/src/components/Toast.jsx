import { useEffect, useState } from 'react'

export default function Toast({ message, type = 'info', onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  const colors = {
    info:    'var(--accent)',
    success: 'var(--green)',
    error:   'var(--danger)',
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease, transform 0.3s ease',
      background: 'var(--surface)',
      color: colors[type],
      padding: '12px 24px',
      borderRadius: 'var(--r-pill)',
      boxShadow: 'var(--neu-raised)',
      fontFamily: 'var(--font)',
      fontWeight: 700,
      fontSize: 14,
      zIndex: 999,
      whiteSpace: 'nowrap',
      borderLeft: `4px solid ${colors[type]}`,
    }}>
      {message}
    </div>
  )
}
