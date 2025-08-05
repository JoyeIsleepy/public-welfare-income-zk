'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getSharedResume, formatExpiryTime } from '../../../lib/share-utils'
import { Loader, AlertCircle, Clock, User, GraduationCap, Briefcase, Award, Globe } from 'lucide-react'

interface ResumeInfo {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
  }
  education: {
    degree: string
    university: string
    graduationYear: string
    major: string
    gpa?: string
    englishLevel?: string
  }
  experience: {
    company: string
    position: string
    duration: string
    description: string
  }[]
  skills: string[]
  certifications?: string[]
  languages?: {
    language: string
    level: string
    certification: string
  }[]
}

export default function SharePage() {
  const params = useParams()
  const shareId = params.shareId as string
  
  const [resumeData, setResumeData] = useState<ResumeInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expiresAt, setExpiresAt] = useState<number>(0)

  useEffect(() => {
    if (!shareId) return

    const fetchSharedResume = async () => {
      try {
        const data = await getSharedResume(shareId)
        setResumeData(data.resumeData)
        setExpiresAt(data.expiresAt)
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        setLoading(false)
      }
    }

    fetchSharedResume()
  }, [shareId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">正在加载简历...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">加载失败</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">未找到简历数据</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 头部信息 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">共享简历</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatExpiryTime(expiresAt)}</span>
          </div>
        </div>

        {/* 简历内容 */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            {/* 个人信息 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">个人信息</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg">
                <div>
                  <span className="text-sm text-gray-600">姓名:</span>
                  <span className="ml-2 font-medium text-gray-800">{resumeData.personalInfo.name}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">邮箱:</span>
                  <span className="ml-2 font-medium text-gray-800">{resumeData.personalInfo.email}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">电话:</span>
                  <span className="ml-2 font-medium text-gray-800">{resumeData.personalInfo.phone}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">地址:</span>
                  <span className="ml-2 font-medium text-gray-800">{resumeData.personalInfo.location}</span>
                </div>
              </div>
            </div>

            {/* 教育背景 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-800">教育背景</h2>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="font-medium text-lg mb-2">{resumeData.education.degree}</div>
                <div className="text-gray-700 mb-2">
                  {resumeData.education.university} • {resumeData.education.major}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  毕业年份: {resumeData.education.graduationYear}
                </div>
                {resumeData.education.gpa && (
                  <div className="text-sm text-gray-600 mb-2">
                    GPA: {resumeData.education.gpa}
                  </div>
                )}
                {resumeData.education.englishLevel && (
                  <div className="text-sm text-green-700 font-medium">
                    英语水平: {resumeData.education.englishLevel}
                  </div>
                )}
              </div>
            </div>

            {/* 工作经历 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">工作经历</h2>
              </div>
              <div className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-lg">{exp.position}</div>
                      <div className="text-sm text-gray-600">{exp.duration}</div>
                    </div>
                    <div className="text-purple-700 font-medium mb-2">{exp.company}</div>
                    <div className="text-gray-700 text-sm">{exp.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 技能 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-800">技能</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 证书 */}
            {resumeData.certifications && resumeData.certifications.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-yellow-600" />
                  <h2 className="text-xl font-semibold text-gray-800">证书</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 语言能力 */}
            {resumeData.languages && resumeData.languages.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">语言能力</h2>
                </div>
                <div className="space-y-3">
                  {resumeData.languages.map((lang, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{lang.language}</span>
                        <span className="text-sm text-blue-600">{lang.level}</span>
                      </div>
                      {lang.certification && (
                        <div className="text-sm text-gray-600 mt-1">
                          {lang.certification}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部信息 */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>本简历通过 Resume ZK 平台分享</p>
        </div>
      </div>
    </div>
  )
}