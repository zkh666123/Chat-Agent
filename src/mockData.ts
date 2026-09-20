import type { Conversation } from './types'

export interface QuickPrompt {
  id: string
  title: string
  desc: string
}

/** 空状态快捷提问卡片 */
export const quickPrompts: QuickPrompt[] = [
  { id: 'q1', title: '帮我写一份周报', desc: '总结本周工作亮点' },
  { id: 'q2', title: '解释一下 React 18', desc: '新特性简明扼要' },
  { id: 'q3', title: '写一个防抖函数', desc: '附使用示例' },
  { id: 'q4', title: '推荐前端进阶路线', desc: '学习方向与资源' },
]

const now = Date.now()

/** 页面加载时展示的历史会话（含 2~3 条 mock 历史消息） */
export const initialConversations: Conversation[] = [
  {
    id: 'c1',
    title: '什么是 AI Agent',
    createdAt: now - 3600_000,
    updatedAt: now - 3500_000,
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: '什么是 AI Agent？',
        createdAt: now - 3600_000,
      },
      {
        id: 'm2',
        role: 'assistant',
        content:
          '**AI Agent**（智能体）是指能够**感知环境、自主决策并执行任务**的人工智能系统。\n\n核心能力包括：\n- 理解目标（规划）\n- 调用工具（执行）\n- 自我反思（优化）\n\n```ts\n// 一个简单的 Agent 循环\nwhile (!task.done) {\n  const plan = agent.plan(task)\n  agent.execute(plan)\n}\n```',
        status: 'done',
        createdAt: now - 3500_000,
      },
    ],
  },
  {
    id: 'c2',
    title: '帮我写一份周报',
    createdAt: now - 7200_000,
    updatedAt: now - 7000_000,
    messages: [
      {
        id: 'm3',
        role: 'user',
        content: '帮我写一份前端周报',
        createdAt: now - 7200_000,
      },
      {
        id: 'm4',
        role: 'assistant',
        content:
          '本周主要完成了以下工作：\n\n1. **重构消息列表组件**，提升长列表滚动性能\n2. **修复**聊天输入框在移动端的兼容问题\n3. 完成新版**空状态页面**的设计与实现\n\n下周计划：\n- 完善流式输出的错误重试机制\n- 补充单元测试',
        status: 'done',
        createdAt: now - 7000_000,
      },
    ],
  },
  {
    id: 'c3',
    title: 'React 18 新特性',
    createdAt: now - 86400_000,
    updatedAt: now - 86000_000,
    messages: [
      {
        id: 'm5',
        role: 'user',
        content: 'React 18 有哪些新特性？',
        createdAt: now - 86400_000,
      },
      {
        id: 'm6',
        role: 'assistant',
        content:
          'React 18 带来了以下重要更新：\n\n- **并发渲染**（Concurrent Rendering）\n- **自动批处理**（Automatic Batching）\n- **useTransition** / **useDeferredValue**\n- **Suspense** 服务端渲染支持\n\n```jsx\nconst [isPending, startTransition] = useTransition()\nstartTransition(() => setState(next))\n```',
        status: 'done',
        createdAt: now - 86000_000,
      },
    ],
  },
]

/** AI 自动回复池（mock） */
export const aiReplyPool: string[] = [
  // 0 技术类
  '好的，这个问题可以从以下几个方面入手：\n\n1. **明确输入与输出**\n2. 拆分核心逻辑\n3. 用代码验证\n\n```ts\nfunction debounce<T extends (...args: never[]) => void>(\n  fn: T,\n  delay = 300,\n) {\n  let timer: ReturnType<typeof setTimeout>\n  return (...args: Parameters<T>) => {\n    clearTimeout(timer)\n    timer = setTimeout(() => fn(...args), delay)\n  }\n}\n```\n\n如果还需要更详细的说明，随时告诉我。',
  // 1 写作/总结类
  '好的，我帮你整理一份**周报模板**：\n\n## 本周工作\n\n- **项目 A**：完成核心模块开发与联调\n- **项目 B**：修复线上问题 3 个，编写回归用例\n- **团队**：参与技术方案评审，输出 2 份文档\n\n## 下周计划\n\n1. 推进项目 A 的性能优化\n2. 补充自动化测试覆盖\n\n需要的话我可以帮你填入具体内容。',
  // 2 计划/方案类
  '我建议按下面的路线推进：\n\n| 阶段 | 重点 | 产出 |\n| --- | --- | --- |\n| 基础 | 掌握核心概念 | 能独立写 demo |\n| 进阶 | 理解原理与生态 | 完成一个中型项目 |\n| 实战 | 参与开源/项目 | 形成自己的作品集 |\n\n> 提示：学习时**边做边学**效率最高。',
]

/** 按用户输入关键词匹配 AI 回复，匹配不到返回随机默认回复 */
export function pickAiReply(input: string): string {
  const text = input.toLowerCase()
  if (/react|前端|typescript|javascript|代码|函数|防抖|组件|js/.test(text)) {
    return aiReplyPool[0]
  }
  if (/周报|总结|报告|文档|ppt/.test(text)) {
    return aiReplyPool[1]
  }
  if (/计划|步骤|方案|路线|学习|建议/.test(text)) {
    return aiReplyPool[2]
  }
  return aiReplyPool[Math.floor(Math.random() * aiReplyPool.length)]
}

/** 模拟失败的回复内容（用于演示发送失败 + 重试） */
export const failReply =
  '很抱歉，我在生成回答时遇到了**网络异常**，本次回复未能完成。\n\n请点击下方的「重试」按钮，我会重新生成。'