// 简历解析工具类

export interface ResumeInfo {
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

export async function parseResumeFile(file: File): Promise<ResumeInfo> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/parse-resume', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '解析失败')
  }

  const { resumeInfo } = await response.json()
  return resumeInfo
}

// 客户端文件验证
export function validateResumeFile(file: File): string | null {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  if (file.size > maxSize) {
    return '文件大小不能超过10MB'
  }

  if (!allowedTypes.includes(file.type)) {
    return '仅支持PDF、DOC、DOCX格式的文件'
  }

  return null
}

// 文本预处理
export function preprocessText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // 合并多个空白字符
    .replace(/\n\s*\n/g, '\n') // 合并多个换行
    .trim()
}

// 提取邮箱
export function extractEmail(text: string): string {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const matches = text.match(emailRegex)
  return matches?.[0] || ''
}

// 提取电话号码
export function extractPhone(text: string): string {
  const phoneRegex = /(\+86[-\s]?)?1[3-9]\d{9}|(\d{3,4}[-\s]?)?\d{7,8}/g
  const matches = text.match(phoneRegex)
  return matches?.[0] || ''
}

// 提取技能关键词
export function extractSkills(text: string): string[] {
  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
    'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP',
    'HTML', 'CSS', 'SCSS', 'Sass', 'Tailwind',
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'Git', 'Linux', 'Nginx', 'Spring', 'Express',
    'Webpack', 'Vite', 'Babel', 'Jest', 'Cypress'
  ]

  const foundSkills: string[] = []
  const textLower = text.toLowerCase()

  commonSkills.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      foundSkills.push(skill)
    }
  })

  return [...new Set(foundSkills)] // 去重
}