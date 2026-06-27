import { useState, useRef } from 'react'

function AttachButton({ icon, title, accept, onFile }) {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files[0]
          if (file) onFile(file)
          e.target.value = ''
        }}
      />
      <button
        title={title}
        onClick={() => ref.current.click()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 36, height: 36,
          borderRadius: '50%',
          border: 'none',
          background: 'var(--surface)',
          cursor: 'pointer',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 17,
          boxShadow: hovered ? 'var(--neu-inset-sm)' : 'var(--neu-raised-sm)',
          transition: 'box-shadow 0.15s ease',
        }}
      >
        {icon}
      </button>
    </>
  )
}

function FilePreview({ file, onRemove }) {
  const isImage = file.type.startsWith('image/')
  const url = isImage ? URL.createObjectURL(file) : null

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 10px',
      borderRadius: 'var(--r-sm)',
      background: 'var(--surface)',
      boxShadow: 'var(--neu-inset-sm)',
      marginBottom: 8,
    }}>
      {isImage
        ? <img src={url} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
        : <span style={{ fontSize: 22 }}>📄</span>
      }
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', margin: 0,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {file.name}
        </p>
        <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>
      <button
        onClick={onRemove}
        style={{
          border: 'none', background: 'none', cursor: 'pointer',
          color: 'var(--danger)', fontSize: 16, padding: 4,
        }}
      >✕</button>
    </div>
  )
}

export default function MessageInput({ onSend }) {
  const [text,    setText]    = useState('')
  const [pressed, setPressed] = useState(false)
  const [files,   setFiles]   = useState([])

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed && files.length === 0) return
    onSend(trimmed, files)
    setText('')
    setFiles([])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const addFile = (file) => setFiles(prev => [...prev, file])
  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--r)',
      boxShadow: 'var(--neu-raised-sm)',
      padding: '12px 16px',
    }}>
      {files.length > 0 && (
        <div style={{ marginBottom: 4 }}>
          {files.map((f, i) => (
            <FilePreview key={i} file={f} onRemove={() => removeFile(i)} />
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <AttachButton icon="🖼️" title="Send image" accept="image/*" onFile={addFile} />
        <AttachButton icon="📎" title="Send document" accept=".pdf,.doc,.docx,.txt,.zip,.xls,.xlsx,.ppt,.pptx" onFile={addFile} />

        <textarea
          rows={1}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font)',
            fontSize: 15,
            color: 'var(--text)',
            resize: 'none',
            lineHeight: 1.5,
            maxHeight: 100,
            overflowY: 'auto',
          }}
        />

        <button
          onClick={handleSend}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          style={{
            width: 44, height: 44,
            borderRadius: '50%',
            border: 'none',
            background: 'var(--accent)',
            color: '#fff',
            fontSize: 18,
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: pressed
              ? 'inset 3px 3px 8px rgba(0,0,0,0.2)'
              : '4px 4px 12px rgba(108,99,255,0.4), -2px -2px 6px #ffffff',
            transition: 'box-shadow 0.15s ease, transform 0.15s ease',
            transform: pressed ? 'scale(0.95)' : 'scale(1)',
          }}
        >
          ➤
        </button>
      </div>
    </div>
  )
}
