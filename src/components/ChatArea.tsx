import type { Conversation } from '../types'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import EmptyState from './EmptyState'

interface ChatAreaProps {
  conversation: Conversation
  onSend: (text: string) => void
  isGenerating: boolean
  onStop: () => void
  onRetry: (convId: string, messageId: string) => void
}

export default function ChatArea({
  conversation,
  onSend,
  isGenerating,
  onStop,
  onRetry,
}: ChatAreaProps) {
  const isEmpty = conversation.messages.length === 0

  return (
    <main className="chat-area">
      <header className="chat-header">
        <span className="chat-header-title">{conversation.title}</span>
      </header>
      {isEmpty ? (
        <EmptyState onPick={onSend} />
      ) : (
        <MessageList
          messages={conversation.messages}
          onRetry={messageId => onRetry(conversation.id, messageId)}
        />
      )}
      <ChatInput onSend={onSend} isGenerating={isGenerating} onStop={onStop} />
    </main>
  )
}