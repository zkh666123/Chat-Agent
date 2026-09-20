import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'

interface ChatInputProps {
  onSend: (text: string) => void
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const submit = () => {
    const text = value.trim()
    if (!text) return
    onSend(text)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  return (
    <div className="chat-input-area">
      <div className="chat-input-wrapper">
        <textarea
          ref={textareaRef}
          className="chat-input"
          placeholder="给 AI 助手发消息，Enter 发送，Shift+Enter 换行"
          value={value}
          rows={1}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button className="send-btn" onClick={submit} disabled={!value.trim()}>
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M2 8L14 2l-3 6 3 6-12-6z" />
          </svg>
        </button>
      </div>
      <p className="chat-input-tip">内容由 AI 生成，请仔细甄别</p>
    </div>
  )
}