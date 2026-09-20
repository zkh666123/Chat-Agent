import { quickPrompts } from '../mockData'
import AssistantAvatar from './AssistantAvatar'

interface EmptyStateProps {
  /** 点击快捷提问卡片直接发送该问题 */
  onPick: (text: string) => void
}

export default function EmptyState({ onPick }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <AssistantAvatar size="large" />
      <h1 className="empty-title">你好，我是 AI 助手</h1>
      <p className="empty-subtitle">
        我可以帮你写代码、做总结、解答问题，试试下面的提问吧
      </p>
      <div className="quick-grid">
        {quickPrompts.map(q => (
          <button key={q.id} className="quick-card" onClick={() => onPick(q.title)}>
            <span className="quick-title">{q.title}</span>
            <span className="quick-desc">{q.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}