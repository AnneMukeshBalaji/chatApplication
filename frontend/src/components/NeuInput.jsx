import { useState } from 'react'

export default function NeuInput({ label, id, type = 'text', placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ marginBottom: 20 }}>
      {label && (
        <label htmlFor={id} style={{
          display: 'block',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.7px',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          marginBottom: 8,
          fontFamily: 'var(--font)',
        }}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="off"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '14px 18px',
          border: 'none',
          outline: 'none',
          borderRadius: 'var(--r-sm)',
          background: 'var(--surface)',
          color: 'var(--text)',
          fontFamily: 'var(--font)',
          fontSize: 15,
          boxShadow: focused
            ? 'var(--neu-inset-sm), 0 0 0 2px var(--accent)'
            : 'var(--neu-inset-sm)',
          transition: 'box-shadow 0.2s ease',
        }}
      />
    </div>
  )
}
