import { useState } from 'react'
import type { Conversation } from './types'
import { initialConversations } from './mockData'
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
    // S3 接入：追加用户消息并触发 AI 回复
    console.log('send:', text)
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