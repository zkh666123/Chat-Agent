export type Role = 'user' | 'assistant'

export type MessageStatus = 'pending' | 'streaming' | 'done' | 'error'

export interface Message {
  id: string
  role: Role
  content: string
  /** 消息状态：pending 等待响应 / streaming 生成中 / done 已完成 / error 发送失败 */
  status?: MessageStatus
  createdAt: number
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}