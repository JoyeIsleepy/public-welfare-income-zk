import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// 临时存储，实际应该使用数据库
const shareStorage = new Map<string, {
  data: any
  createdAt: number
  expiresAt: number
}>()

export async function POST(request: NextRequest) {
  try {
    const { resumeData } = await request.json()
    
    if (!resumeData) {
      return NextResponse.json({ error: '简历数据不能为空' }, { status: 400 })
    }

    // 生成唯一的分享ID
    const shareId = crypto.randomBytes(16).toString('hex')
    
    // 设置过期时间（7天）
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000
    
    // 存储分享数据
    shareStorage.set(shareId, {
      data: resumeData,
      createdAt: Date.now(),
      expiresAt
    })

    // 清理过期数据
    cleanupExpiredShares()

    return NextResponse.json({ 
      shareId,
      shareUrl: `${request.nextUrl.origin}/share/${shareId}`,
      expiresAt
    })
  } catch (error) {
    console.error('创建分享链接失败:', error)
    return NextResponse.json({ error: '创建分享链接失败' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shareId = searchParams.get('id')
    
    if (!shareId) {
      return NextResponse.json({ error: '分享ID不能为空' }, { status: 400 })
    }

    const shareData = shareStorage.get(shareId)
    
    if (!shareData) {
      return NextResponse.json({ error: '分享链接不存在或已过期' }, { status: 404 })
    }

    // 检查是否过期
    if (Date.now() > shareData.expiresAt) {
      shareStorage.delete(shareId)
      return NextResponse.json({ error: '分享链接已过期' }, { status: 410 })
    }

    return NextResponse.json({ 
      resumeData: shareData.data,
      createdAt: shareData.createdAt,
      expiresAt: shareData.expiresAt
    })
  } catch (error) {
    console.error('获取分享数据失败:', error)
    return NextResponse.json({ error: '获取分享数据失败' }, { status: 500 })
  }
}

// 清理过期的分享数据
function cleanupExpiredShares() {
  const now = Date.now()
  for (const [shareId, shareData] of shareStorage.entries()) {
    if (now > shareData.expiresAt) {
      shareStorage.delete(shareId)
    }
  }
}