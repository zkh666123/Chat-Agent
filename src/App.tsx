import { useEffect, useRef, useState } from 'react'
import type { Conversation } from './types'
import { initialConversations, pickAiReply, failReply } from './mockData'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'

function App() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [activeId, setActiveId] = useState(initialConversations[0].id)
  const [isGenerating, setIsGenerating] = useState(false)

  const conversationsRef = useRef(conversations)
  useEffect(() => {
    conversationsRef.current = conversations
  }, [conversations])

  const streamRef = useRef<{
    convId: string
    msgId: string
    startTimer: number | null
    interval: number | null
  } | null>(null)

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (streamRef.current?.startTimer != null) clearTimeout(streamRef.current.startTimer)
      if (streamRef.current?.interval != null) clearInterval(streamRef.current.interval)
    }
  }, [])

  const activeConversation = conversations.find(c => c.id === activeId) ?? conversations[0]

  /** 开始流式生成：每 40ms 追加 2~4 个字符，模拟 SSE 打字机效果 */
  const beginStreaming = (
    convId: string,
    msgId: string,
    replyContent: string,
    shouldFail: boolean,
  ) => {
    setIsGenerating(true)

    setConversations(prev =>
      prev.map(c => {
        if (c.id !== convId) return c
        return {
          ...c,
          messages: c.messages.map(m =>
            m.id === msgId ? { ...m, content: '', status: 'streaming' as const } : m,
          ),
        }
      }),
    )

    let index = 0
    const interval = window.setInterval(() => {
      // 失败场景：输出到一半后转为失败
      if (shouldFail && index >= Math.floor(failReply.length / 2)) {
        clearInterval(interval)
        streamRef.current = null
        setIsGenerating(false)
        setConversations(prev =>
          prev.map(c => {
            if (c.id !== convId) return c
            return {
              ...c,
              messages: c.messages.map(m =>
                m.id === msgId ? { ...m, content: failReply, status: 'error' as const } : m,
              ),
            }
          }),
        )
        return
      }

      index += 2 + Math.floor(Math.random() * 3)
      const next = replyContent.slice(0, index)
      setConversations(prev =>
        prev.map(c => {
          if (c.id !== convId) return c
          return {
            ...c,
            messages: c.messages.map(m =>
              m.id === msgId ? { ...m, content: next, status: 'streaming' as const } : m,
            ),
          }
        }),
      )

      if (index >= replyContent.length) {
        clearInterval(interval)
        streamRef.current = null
        setIsGenerating(false)
        setConversations(prev =>
          prev.map(c => {
            if (c.id !== convId) return c
            return {
              ...c,
              messages: c.messages.map(m =>
                m.id === msgId ? { ...m, content: replyContent, status: 'done' as const } : m,
              ),
            }
          }),
        )
      }
    }, 40)

    streamRef.current = { convId, msgId, startTimer: null, interval }
  }

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
    if (isGenerating) return
    const now = Date.now()
    const targetId = activeId
    const msgId = `a-${now}`
    const shouldFail = /失败|error/i.test(text)
    const replyContent = pickAiReply(text)

    // 追加用户消息 + AI pending 占位
    setConversations(prev =>
      prev.map(c => {
        if (c.id !== targetId) return c
        const isFirst = c.messages.length === 0
        return {
          ...c,
          title: isFirst ? text.slice(0, 12) : c.title,
          messages: [
            ...c.messages,
            { id: `u-${now}`, role: 'user' as const, content: text, createdAt: now },
            {
              id: msgId,
              role: 'assistant' as const,
              content: '',
              status: 'pending' as const,
              createdAt: now,
            },
          ],
          updatedAt: now,
        }
      }),
    )

    setIsGenerating(true)
    const startTimer = window.setTimeout(() => {
      beginStreaming(targetId, msgId, replyContent, shouldFail)
    }, 300)
    streamRef.current = { convId: targetId, msgId, startTimer, interval: null }
  }

  /** 停止生成：清除定时器，保留已输出内容 */
  const handleStop = () => {
    const cur = streamRef.current
    if (!cur) return
    if (cur.startTimer != null) clearTimeout(cur.startTimer)
    if (cur.interval != null) clearInterval(cur.interval)
    const { convId, msgId } = cur
    setConversations(prev =>
      prev.map(c => {
        if (c.id !== convId) return c
        return {
          ...c,
          messages: c.messages.map(m => (m.id === msgId ? { ...m, status: 'done' as const } : m)),
        }
      }),
    )
    streamRef.current = null
    setIsGenerating(false)
  }

  /** 失败重试：重新生成（重试不再失败） */
  const handleRetry = (convId: string, messageId: string) => {
    if (isGenerating) return
    const conv = conversationsRef.current.find(c => c.id === convId)
    if (!conv) return
    const msgIndex = conv.messages.findIndex(m => m.id === messageId)
    if (msgIndex < 0) return

    // 找到该 assistant 消息之前的最后一条用户消息作为回复依据
    let userText = ''
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (conv.messages[i].role === 'user') {
        userText = conv.messages[i].content
        break
      }
    }
    if (!userText) return

    setConversations(prev =>
      prev.map(c => {
        if (c.id !== convId) return c
        return {
          ...c,
          messages: c.messages.map(m =>
            m.id === messageId ? { ...m, content: '', status: 'pending' as const } : m,
          ),
        }
      }),
    )
    setIsGenerating(true)
    const startTimer = window.setTimeout(() => {
      beginStreaming(convId, messageId, pickAiReply(userText), false)
    }, 300)
    streamRef.current = { convId, msgId: messageId, startTimer, interval: null }
  }

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onNewChat={handleNewChat}
        onSelect={handleSelect}
      />
      <ChatArea
        conversation={activeConversation}
        onSend={handleSend}
        isGenerating={isGenerating}
        onStop={handleStop}
        onRetry={handleRetry}
      />
    </div>
  )
}

export default App