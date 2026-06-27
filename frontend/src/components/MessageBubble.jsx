function StatusIcon({ status }) {
  if (!status)                return null
  if (status === 'PENDING')   return <span title="Pending"   style={{ opacity: 0.5 }}>🕐</span>
  if (status === 'DELIVERED') return <span title="Delivered" style={{ opacity: 0.7 }}>✓</span>
  if (status === 'READ')      return <span title="Read"      style={{ color: 'var(--accent)' }}>✓✓</span>
  return null
}

function Attachment({ attachment, isMe }) {
  if (attachment.type.startsWith('image/') && attachment.url) {
    return (
      <img
        src={attachment.url}
        alt={attachment.name}
        style={{
          maxWidth: '100%',
          maxHeight: 200,
          borderRadius: 10,
          display: 'block',
          marginBottom: 6,
          objectFit: 'cover',
        }}
      />
    )
  }
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      borderRadius: 10,
      background: isMe ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)',
      marginBottom: 6,
    }}>
      <span style={{ fontSize: 20 }}>📄</span>
      <span style={{
        fontSize: 13,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: 180,
        color: isMe ? '#fff' : 'var(--text)',
      }}>
        {attachment.name}
      </span>
    </div>
  )
}

export default function MessageBubble({ message }) {
  const isMe = message.from === 'me'
  const hasContent = message.text || (message.attachments && message.attachments.length > 0)
  if (!hasContent) return null

  return (
    <div style={{
      display: 'flex',
      justifyContent: isMe ? 'flex-end' : 'flex-start',
      marginBottom: 10,
    }}>
      <div style={{
        maxWidth: '68%',
        padding: '11px 16px',
        borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isMe ? 'var(--accent)' : 'var(--surface)',
        color: isMe ? '#fff' : 'var(--text)',
        boxShadow: isMe
          ? '4px 4px 12px rgba(108,99,255,0.35), -2px -2px 6px rgba(255,255,255,0.6)'
          : 'var(--neu-raised-sm)',
        fontFamily: 'var(--font)',
      }}>
        {message.attachments?.map((a, i) => (
          <Attachment key={i} attachment={a} isMe={isMe} />
        ))}

        {message.text && (
          <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0 }}>
            {message.text}
          </p>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 4,
          marginTop: 5,
        }}>
          <span style={{ fontSize: 11, opacity: 0.65, fontFamily: 'var(--font)' }}>
            {message.time}
          </span>
          {isMe && (
            <span style={{ fontSize: 12 }}>
              <StatusIcon status={message.status} />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
