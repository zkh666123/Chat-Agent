import type { Message } from '../types'
import MarkdownRenderer from './MarkdownRenderer'
import AssistantAvatar from './AssistantAvatar'

interface MessageItemProps {
  message: Message
  onRetry: (messageId: string) => void
}

export default function MessageItem({ message, onRetry }: MessageItemProps) {
  if (message.role === 'user') {
    return (
      <div className="message-row user">
        <div className="message-content">
          <div className="user-bubble">{message.content}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="message-row assistant">
      <AssistantAvatar />
      <div className="message-content">
        <div className="assistant-card">
          {message.status === 'pending' ? (
            <div className="thinking">
              <span className="thinking-dot" />
              <span className="thinking-dot" />
              <span className="thinking-dot" />
            </div>
          ) : (
            <>
              <MarkdownRenderer content={message.content} />
              {message.status === 'streaming' && (
                <span className="streaming-cursor" aria-hidden="true" />
              )}
            </>
          )}
          {message.status === 'error' && (
            <div className="error-bar">
              <span>生成失败，请重试</span>
              <button className="retry-btn" onClick={() => onRetry(message.id)}>
                重试
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}