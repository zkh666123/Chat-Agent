# AI Agent Web 对话界面

一个基于 **React 18 + Vite + TypeScript** 的 AI Agent Web 对话界面 Demo。整体视觉参考主流 AI 助手产品（豆包）的典型布局：**左侧会话列表 + 右侧对话区 + 底部输入区**。

所有数据均为前端 **Mock 数据**模拟，无真实后端。AI 回复以打字机效果流式输出，并支持停止生成、失败重试、Markdown 渲染与代码块复制。

---

## 启动方式

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview

# 代码检查
npm run lint
```

> 要求 Node.js 18+（本项目在 Node 22 上开发验证）。

---

## 技术选型

| 分类 | 选型 | 说明 |
| --- | --- | --- |
| 框架 | React 18 | 题目硬性要求 |
| 构建工具 | Vite 6 | 开发服务器启动快，HMR 热更新 |
| 语言 | TypeScript 5 | 类型安全，数据结构清晰 |
| Markdown 渲染 | react-markdown + remark-gfm | 支持加粗、列表、表格、代码块等 GFM 语法 |
| 样式方案 | 纯 CSS + CSS 变量 | 零额外依赖，主题色集中管理 |

---

## 目录结构

```
├── index.html                  # HTML 入口
├── package.json                # 项目依赖与脚本
├── vite.config.ts              # Vite 配置
├── tsconfig*.json              # TypeScript 配置
├── public/                     # 静态资源（favicon 等）
└── src/
    ├── main.tsx                # React 挂载入口
    ├── App.tsx                 # 全局状态与会话管理、流式生成逻辑
    ├── index.css               # 全局样式（豆包风格主题）
    ├── types.ts                # 核心数据类型定义
    ├── mockData.ts             # Mock 数据（历史会话、回复池、快捷提问）
    └── components/
        ├── Sidebar.tsx         # 左侧会话列表（新建/切换）
        ├── ChatArea.tsx        # 右侧对话区容器（消息列表 + 输入区）
        ├── ChatInput.tsx       # 底部输入框（Enter 发送 / 停止生成）
        ├── MessageList.tsx     # 消息列表（智能自动滚动）
        ├── MessageItem.tsx     # 单条消息（用户气泡 / AI 卡片 / 状态）
        ├── MarkdownRenderer.tsx # Markdown 渲染 + 代码块复制
        ├── EmptyState.tsx      # 空状态（问候语 + 快捷提问卡片）
        └── AssistantAvatar.tsx # AI 头像（SVG）
```

---

## Mock 数据结构

### 消息 `Message`

```ts
type Role = 'user' | 'assistant'

type MessageStatus = 'pending' | 'streaming' | 'done' | 'error'

interface Message {
  id: string          // 唯一 ID（用户消息 u-* / AI 消息 a-*）
  role: Role          // 消息角色
  content: string     // 文本内容（Markdown）
  status?: MessageStatus
  // 状态说明：
  // - pending   等待开始生成（思考中 loading）
  // - streaming 打字机输出中（闪烁光标）
  // - done      生成完成
  // - error     生成失败（可重试）
  createdAt: number   // 时间戳
}
```

### 会话 `Conversation`

```ts
interface Conversation {
  id: string
  title: string              // 会话标题（新会话以首条消息截取）
  messages: Message[]        // 消息列表
  createdAt: number
  updatedAt: number
}
```

### Mock 数据说明

| 数据 | 位置 | 说明 |
| --- | --- | --- |
| 历史会话 | `mockData.ts` 的 `initialConversations` | 预置 3 个会话，每个 2 条历史消息 |
| 快捷提问 | `quickPrompts` | 空状态页 2×2 卡片，点击直接发送 |
| AI 回复池 | `aiReplyPool` | 3 条预设回复，按关键词匹配：技术 / 写作总结 / 计划方案 |
| 失败回复 | `failReply` | 模拟生成失败的回复文案 |
| 关键词匹配 | `pickAiReply(input)` | 含 `react/前端/代码` 等→技术回复；`周报/总结`→写作模板；`计划/路线`→方案表格；否则随机 |

---

## 功能特性

- **布局**：左侧会话列表（新建对话 / 历史会话 / 切换）+ 右侧对话区 + 底部输入区
- **消息渲染**：用户消息右侧蓝色气泡；AI 消息左侧头像 + 卡片，支持 Markdown（加粗、列表、表格、代码块），代码块右上角一键复制
- **输入交互**：Enter 发送、Shift+Enter 换行、发送后清空输入框
- **流式输出**：每 40ms 追加 2~4 字符模拟打字机；新内容自动滚动，用户上滚不打断；生成中可点击「停止」保留已输出内容
- **失败重试**：输入包含「失败」或「error」会模拟生成失败，点击「重试」重新生成
- **空状态**：首次进入新对话显示问候语 + 快捷提问卡片，点击卡片直接发送

---

## 触发失败演示

在输入框发送包含 **「失败」** 或 **「error」** 的文字（例如：`模拟失败场景`），AI 回复输出到一半会转为失败状态，点击「重试」即可重新生成。

---

## Git 提交历史

```
fee2755 feat: 实现移动端侧边栏抽屉与响应式布局
9f5fc69 fix: 修复切换会话后消息列表滚动位置不重置的问题
693c14a docs: 补充项目 README（启动方式/技术选型/目录结构/Mock 数据）
1131ade feat: 实现空状态与历史记录
8ffddee feat: 实现流式输出与交互控制
153d512 feat: 实现消息发送与 mock AI 回复（关键词匹配）
e6a1bdd fix: 修复全局样式未引入导致页面无样式的问题
10f9d88 feat: 完成页面布局与会话列表
1d7b241 feat: 初始化 React 18 + Vite + TS 工程，清理模板并配置依赖
```