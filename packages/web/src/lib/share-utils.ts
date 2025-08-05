// 分享功能工具类

export interface ShareResponse {
  shareId: string
  shareUrl: string
  expiresAt: number
}

export interface ShareData {
  resumeData: any
  createdAt: number
  expiresAt: number
}

// 创建分享链接
export async function createShareLink(resumeData: any): Promise<ShareResponse> {
  const response = await fetch('/api/share-resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ resumeData }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '创建分享链接失败')
  }

  return await response.json()
}

// 获取分享数据
export async function getSharedResume(shareId: string): Promise<ShareData> {
  const response = await fetch(`/api/share-resume?id=${shareId}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '获取分享数据失败')
  }

  return await response.json()
}

// 复制到剪贴板
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const success = document.execCommand('copy')
      textArea.remove()
      return success
    }
  } catch (error) {
    console.error('复制失败:', error)
    return false
  }
}

// 格式化过期时间
export function formatExpiryTime(expiresAt: number): string {
  const now = Date.now()
  const diff = expiresAt - now
  
  if (diff <= 0) {
    return '已过期'
  }
  
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  
  if (days > 0) {
    return `${days}天${hours}小时后过期`
  } else if (hours > 0) {
    return `${hours}小时后过期`
  } else {
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
    return `${minutes}分钟后过期`
  }
}

// 生成分享文案
export function generateShareText(resumeData: any): string {
  const name = resumeData?.personalInfo?.name || '某位候选人'
  const university = resumeData?.education?.university || ''
  const position = resumeData?.experience?.[0]?.position || ''
  
  let shareText = `📄 ${name}的简历分享`
  
  if (university) {
    shareText += `\n🎓 毕业于${university}`
  }
  
  if (position) {
    shareText += `\n💼 最近职位：${position}`
  }
  
  shareText += '\n\n点击链接查看完整简历 👇'
  
  return shareText
}