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
  onOpenSidebar: () => void
}

export default function ChatArea({
  conversation,
  onSend,
  isGenerating,
  onStop,
  onRetry,
  onOpenSidebar,
}: ChatAreaProps) {
  const isEmpty = conversation.messages.length === 0

  return (
    <main className="chat-area">
      <header className="chat-header">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onOpenSidebar}
          aria-label="打开会话列表"
        >
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M2 4h12M2 8h12M2 12h12" />
          </svg>
        </button>
        <span className="chat-header-title ellipsis">{conversation.title}</span>
      </header>
      {isEmpty ? (
        <EmptyState onPick={onSend} />
      ) : (
        <MessageList
          key={conversation.id}
          messages={conversation.messages}
          onRetry={messageId => onRetry(conversation.id, messageId)}
        />
      )}
      <ChatInput onSend={onSend} isGenerating={isGenerating} onStop={onStop} />
    </main>
  )
}