import type { Message } from '../types'
import MessageItem from './MessageItem'

export default function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="message-list">
      {messages.map(message => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  )
}