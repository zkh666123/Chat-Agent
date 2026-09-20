import { useEffect, useRef } from 'react'
import type { Message } from '../types'
import MessageItem from './MessageItem'

interface MessageListProps {
  messages: Message[]
  onRetry: (messageId: string) => void
}

/** 消息列表：新内容自动滚动到底部，用户上滚时不强制拉回 */
export default function MessageList({ messages, onRetry }: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const atBottomRef = useRef(true)

  // 监听用户滚动位置：距离底部 < 80px 视为在底部
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const handleScroll = () => {
      atBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  // 消息变化时：仅在用户位于底部时跟随滚动
  useEffect(() => {
    const el = listRef.current
    if (el && atBottomRef.current) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages])

  return (
    <div className="message-list" ref={listRef}>
      {messages.map(message => (
        <MessageItem key={message.id} message={message} onRetry={onRetry} />
      ))}
    </div>
  )
}