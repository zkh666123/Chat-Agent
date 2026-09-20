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
  '好的，我来帮你分析这个问题。\n\n**核心思路**是分三步走：\n1. 明确目标与约束\n2. 拆解为可执行的小任务\n3. 逐步验证并优化\n\n```js\nfunction solve(problem) {\n  const plan = analyze(problem)\n  return plan.map(execute)\n}\n```\n\n如果需要更详细的说明，随时告诉我。',
  '这是个好问题。\n\n我的理解是：**关键在于把握核心约束**。\n\n- 首先，列出所有限制条件\n- 然后，在约束内寻找最优解\n- 最后，用测试验证可行性\n\n> 提示：可以先从小规模数据开始验证。',
  '我建议按下面的步骤来做：\n\n| 步骤 | 动作 | 说明 |\n| --- | --- | --- |\n| 1 | 梳理需求 | 明确输入输出 |\n| 2 | 设计接口 | 定义清晰类型 |\n| 3 | 实现核心 | 先跑通主流程 |\n| 4 | 打磨细节 | 再优化体验 |\n\n```ts\ninterface Step {\n  name: string\n  done: boolean\n}\n```',
]

/** 模拟失败的回复内容（用于演示发送失败 + 重试） */
export const failReply =
  '很抱歉，我在生成回答时遇到了**网络异常**，本次回复未能完成。\n\n请点击下方的「重试」按钮，我会重新生成。'