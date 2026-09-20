import { useState, isValidElement, type ReactElement, type ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

/** 代码块：深色背景 + 右上角一键复制 */
function CodeBlock({ children }: { children?: ReactNode }) {
  const [copied, setCopied] = useState(false)

  const codeText = (() => {
    if (isValidElement(children)) {
      const props = (children as ReactElement<{ children?: ReactNode }>).props
      const raw = props?.children
      if (Array.isArray(raw)) return raw.join('')
      return String(raw ?? '')
    }
    return String(children ?? '')
  })().replace(/\n$/, '')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // 剪贴板不可用时静默失败
    }
  }

  return (
    <div className="code-block">
      <button className="copy-btn" onClick={handleCopy}>
        {copied ? '已复制' : '复制'}
      </button>
      <pre>{children}</pre>
    </div>
  )
}

const components: Components = {
  pre({ children }) {
    return <CodeBlock>{children}</CodeBlock>
  },
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}