import { useId } from 'react'

interface AssistantAvatarProps {
  size?: 'normal' | 'large'
}

/** AI 头像：渐变圆 + 微笑豆形，模拟豆包风格 */
export default function AssistantAvatar({ size = 'normal' }: AssistantAvatarProps) {
  const gradId = useId()

  return (
    <div className={`assistant-avatar${size === 'large' ? ' large' : ''}`}>
      <svg viewBox="0 0 32 32" width="100%" height="100%" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4f8cff" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="16" fill={`url(#${gradId})`} />
        <path
          d="M16 23.5c-4.2 0-7.5-3.3-7.5-7.5S11.8 8.5 16 8.5s7.5 3.3 7.5 7.5-3.3 7.5-7.5 7.5z"
          fill="#fff"
        />
        <circle cx="13.2" cy="14.8" r="1.3" fill="#4f8cff" />
        <circle cx="18.8" cy="14.8" r="1.3" fill="#4f8cff" />
        <path
          d="M13.2 18.6c1.7 1.4 3.9 1.4 5.6 0"
          stroke="#4f8cff"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  )
}