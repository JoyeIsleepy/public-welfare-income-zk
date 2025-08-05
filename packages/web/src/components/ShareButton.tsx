'use client'

import { useState } from 'react'
import { Share2, Copy, Check, Loader, ExternalLink } from 'lucide-react'
import { createShareLink, copyToClipboard, generateShareText } from '../lib/share-utils'

interface ShareButtonProps {
  resumeData: any
  className?: string
}

export function ShareButton({ resumeData, className = '' }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleShare = async () => {
    if (!resumeData) return

    setIsSharing(true)
    try {
      const result = await createShareLink(resumeData)
      setShareUrl(result.shareUrl)
      setShowModal(true)
    } catch (error) {
      console.error('分享失败:', error)
      alert(error instanceof Error ? error.message : '分享失败')
    } finally {
      setIsSharing(false)
    }
  }

  const handleCopy = async () => {
    const shareText = generateShareText(resumeData)
    const fullText = `${shareText}\n\n${shareUrl}`
    
    const success = await copyToClipboard(fullText)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else {
      alert('复制失败，请手动复制链接')
    }
  }

  const handleCopyUrlOnly = async () => {
    const success = await copyToClipboard(shareUrl)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else {
      alert('复制失败，请手动复制链接')
    }
  }

  return (
    <>
      <button
        onClick={handleShare}
        disabled={isSharing || !resumeData}
        className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white ${className}`}
      >
        <div className="flex items-center gap-2">
          {isSharing ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
          )}
          <span>{isSharing ? '生成中...' : '分享简历'}</span>
          {!isSharing && (
            <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
          )}
        </div>

        {/* 装饰性光效 */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </button>

      {/* 分享模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">分享链接已生成</h3>
              <p className="text-gray-600 text-sm">链接有效期为7天，可以安全分享给他人查看</p>
            </div>

            {/* 分享链接 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">分享链接</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={handleCopyUrlOnly}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors"
                  title="复制链接"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>复制分享文案</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
            </div>

            {/* 预览分享文案 */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">分享文案预览：</p>
              <div className="text-sm text-gray-800 whitespace-pre-line">
                {generateShareText(resumeData)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}