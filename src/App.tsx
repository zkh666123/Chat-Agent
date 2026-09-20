import { useState } from 'react'
import type { Conversation, Message } from './types'
import { initialConversations, pickAiReply } from './mockData'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'

function App() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [activeId, setActiveId] = useState(initialConversations[0].id)

  const activeConversation = conversations.find(c => c.id === activeId) ?? conversations[0]

  const handleNewChat = () => {
    const now = Date.now()
    const conv: Conversation = {
      id: `c-${now}`,
      title: '新对话',
      createdAt: now,
      updatedAt: now,
      messages: [],
    }
    setConversations(prev => [conv, ...prev])
    setActiveId(conv.id)
  }

  const handleSelect = (id: string) => setActiveId(id)

  const handleSend = (text: string) => {
    const now = Date.now()
    const targetId = activeId

    // 1. 追加用户消息，新对话自动以首条消息更新标题
    setConversations(prev =>
      prev.map(c => {
        if (c.id !== targetId) return c
        const isFirst = c.messages.length === 0
        return {
          ...c,
          title: isFirst ? text.slice(0, 12) : c.title,
          messages: [
            ...c.messages,
            { id: `u-${now}`, role: 'user', content: text, createdAt: now },
          ],
          updatedAt: now,
        }
      }),
    )

    // 2. 延迟模拟 AI 回复（S4 将升级为流式输出）
    const reply: Message = {
      id: `a-${now}`,
      role: 'assistant',
      content: pickAiReply(text),
      status: 'done',
      createdAt: now + 600,
    }
    window.setTimeout(() => {
      setConversations(prev =>
        prev.map(c => {
          if (c.id !== targetId) return c
          return {
            ...c,
            messages: [...c.messages, reply],
            updatedAt: Date.now(),
          }
        }),
      )
    }, 600)
  }

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onNewChat={handleNewChat}
        onSelect={handleSelect}
      />
      <ChatArea conversation={activeConversation} onSend={handleSend} />
    </div>
  )
}

export default App