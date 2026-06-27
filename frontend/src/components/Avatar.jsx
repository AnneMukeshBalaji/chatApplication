const styles = {
  base: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    userSelect: 'none',
    flexShrink: 0,
    background: 'var(--accent-soft)',
    color: 'var(--accent)',
    boxShadow: 'var(--neu-raised-sm)',
    fontFamily: 'var(--font)',
  },
  sizes: {
    sm: { width: 32,  height: 32,  fontSize: 13, borderRadius: 10 },
    md: { width: 44,  height: 44,  fontSize: 16, borderRadius: 14 },
    lg: { width: 72,  height: 72,  fontSize: 26, borderRadius: 22 },
    xl: { width: 88,  height: 88,  fontSize: 34, borderRadius: 28, boxShadow: 'var(--neu-raised)' },
  },
  accent: { background: 'var(--accent)', color: '#fff' },
  dot: {
    position: 'absolute',
    bottom: -2, right: -2,
    width: 12, height: 12,
    borderRadius: '50%',
    border: '2px solid var(--surface)',
  },
}

export default function Avatar({ initial, size = 'md', online = null, accent = false }) {
  return (
    <div style={{ ...styles.base, ...styles.sizes[size], ...(accent ? styles.accent : {}) }}>
      {initial}
      {online !== null && (
        <span style={{
          ...styles.dot,
          background: online ? 'var(--green)' : 'var(--sh-d)',
          boxShadow: online ? '0 0 6px rgba(78,203,113,0.6)' : 'none',
        }} />
      )}
    </div>
  )
}
