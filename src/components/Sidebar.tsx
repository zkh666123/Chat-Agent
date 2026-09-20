import type { Conversation } from '../types'

interface SidebarProps {
  conversations: Conversation[]
  activeId: string
  open: boolean
  onNewChat: () => void
  onSelect: (id: string) => void
  onClose: () => void
}

export default function Sidebar({
  conversations,
  activeId,
  open,
  onNewChat,
  onSelect,
  onClose,
}: SidebarProps) {
  return (
    <>
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">AI</span>
            <span>AI 助手</span>
          </div>
          <button className="new-chat-btn" onClick={onNewChat}>
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M8 3v10M3 8h10" />
            </svg>
            新建对话
          </button>
        </div>
        <nav className="conversation-list">
          {conversations.map(conv => (
            <button
              key={conv.id}
              className={`conversation-item${conv.id === activeId ? ' active' : ''}`}
              onClick={() => {
                onSelect(conv.id)
                onClose()
              }}
            >
              <svg
                viewBox="0 0 16 16"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 3.5h12v8H6.5L3.5 14v-2.5H2z" />
              </svg>
              <span className="conversation-item-title ellipsis">{conv.title}</span>
            </button>
          ))}
        </nav>
      </aside>
      {open && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={onClose}
          aria-label="关闭会话列表"
        />
      )}
    </>
  )
}