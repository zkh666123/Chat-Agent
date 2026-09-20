import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'

interface ChatInputProps {
  onSend: (text: string) => void
  isGenerating?: boolean
  onStop?: () => void
}

export default function ChatInput({
  onSend,
  isGenerating = false,
  onStop,
}: ChatInputProps) {
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

  const handleClick = () => {
    if (isGenerating) {
      onStop?.()
      return
    }
    submit()
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
        <button
          className={`send-btn${isGenerating ? ' stop' : ''}`}
          onClick={handleClick}
          disabled={!isGenerating && !value.trim()}
        >
          {isGenerating ? (
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="10" height="10" rx="1.5" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 16 16"
              width="16"
              height="16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M2 8L14 2l-3 6 3 6-12-6z" />
            </svg>
          )}
        </button>
      </div>
      <p className="chat-input-tip">内容由 AI 生成，请仔细甄别</p>
    </div>
  )
}