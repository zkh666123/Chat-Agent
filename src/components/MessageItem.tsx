import type { Message } from '../types'
import MarkdownRenderer from './MarkdownRenderer'
import AssistantAvatar from './AssistantAvatar'

export default function MessageItem({ message }: { message: Message }) {
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
          <MarkdownRenderer content={message.content} />
        </div>
      </div>
    </div>
  )
}