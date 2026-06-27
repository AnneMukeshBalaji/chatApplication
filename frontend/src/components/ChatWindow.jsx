import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'

function TypingIndicator() {
  const dot = (delay) => (
    <span style={{
      width: 8, height: 8,
      borderRadius: '50%',
      background: 'var(--muted)',
      display: 'inline-block',
      animation: `typing-bounce 1.2s ease-in-out ${delay}s infinite`,
    }} />
  )
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0 4px 4px' }}>
      <style>{`
        @keyframes typing-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
      {dot(0)} {dot(0.2)} {dot(0.4)}
      <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 4, fontFamily: 'var(--font)' }}>
        typing…
      </span>
    </div>
  )
}

export default function ChatWindow({ messages, typing = false }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  if (!messages) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--muted)',
        fontFamily: 'var(--font)',
        fontSize: 15,
      }}>
        Select a conversation to start chatting
      </div>
    )
  }

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {typing && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}
