import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: '未找到文件' }, { status: 400 })
    }

    // 验证文件类型
    if (!file.type.includes('pdf') && !file.type.includes('doc')) {
      return NextResponse.json({ error: '仅支持PDF和DOC格式' }, { status: 400 })
    }

    // 读取文件内容
    const buffer = await file.arrayBuffer()
    let extractedText = ''

    try {
      if (file.type.includes('pdf')) {
        extractedText = await extractPDFText(buffer)
      } else if (file.type.includes('doc')) {
        extractedText = await extractDOCText(buffer)
      }
    } catch (error) {
      console.error('文件解析错误:', error)
      return NextResponse.json({ error: '文件解析失败' }, { status: 500 })
    }

    // 使用AI分析文本
    const resumeInfo = await analyzeResumeWithAI(extractedText)
    
    return NextResponse.json({ resumeInfo })
  } catch (error) {
    console.error('简历解析错误:', error)
    return NextResponse.json({ error: '解析失败' }, { status: 500 })
  }
}

async function extractPDFText(buffer: ArrayBuffer): Promise<string> {
  const pdf = require('pdf-parse')
  const data = await pdf(Buffer.from(buffer))
  return data.text
}

async function extractDOCText(buffer: ArrayBuffer): Promise<string> {
  const mammoth = require('mammoth')
  const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) })
  return result.value
}

async function analyzeResumeWithAI(text: string): Promise<ResumeInfo> {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
  
  if (!apiKey) {
    throw new Error('OpenRouter API密钥未配置')
  }

  const prompt = `
你是一个专业的简历分析助手。请从以下简历文本中提取结构化信息，严格按照JSON格式返回。

简历文本：
${text}

请按照以下JSON格式返回，确保所有字段都有值，如果无法提取则使用空字符串或空数组：

{
  "personalInfo": {
    "name": "从简历中提取的真实姓名",
    "email": "从简历中提取的邮箱地址", 
    "phone": "从简历中提取的电话号码",
    "location": "从简历中提取的居住地址"
  },
  "education": {
    "degree": "学位信息（如：计算机科学与技术学士）",
    "university": "毕业院校名称",
    "graduationYear": "毕业年份（YYYY格式）",
    "major": "专业名称",
    "gpa": "GPA或成绩（如果有）",
    "englishLevel": "英语等级（如：CET-4、CET-6、TOEFL、IELTS等，包括分数）"
  },
  "experience": [
    {
      "company": "公司名称",
      "position": "职位名称", 
      "duration": "工作时间段（如：2020.07 - 2023.08）",
      "description": "工作描述和主要职责"
    }
  ],
  "skills": ["技能1", "技能2", "技能3"],
  "certifications": ["证书名称1", "证书名称2"],
  "languages": [
    {
      "language": "语言名称",
      "level": "水平等级",
      "certification": "相关证书或考试成绩"
    }
  ]
}

重点关注事项：
1. **教育信息必须完整**：学校、专业、学位、毕业年份都要准确提取
2. **英语等级信息**：重点提取CET-4、CET-6、托福、雅思等英语水平证明，包括具体分数
3. **工作经历**：如果有多个工作经历，请全部列出，按时间倒序排列
4. **技能分类**：编程语言、框架、工具、软技能等要分类提取
5. **语言能力**：除了英语，还要提取其他语言能力
6. **时间格式**：统一为 YYYY.MM 或 YYYY.MM - YYYY.MM 格式
7. **只返回有效的JSON数据**，不要包含任何其他文本或说明
  `

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Resume Parser'
      },
      body: JSON.stringify({
        model: process.env.NEXT_PUBLIC_AI_MODEL||'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API错误: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('AI响应内容为空')
    }

    // 尝试解析JSON
    try {
      const resumeInfo = JSON.parse(content.trim())
      return resumeInfo
    } catch (parseError) {
      console.error('JSON解析错误:', parseError)
      console.error('AI返回内容:', content)
      throw new Error('AI返回的数据格式无效')
    }
  } catch (error) {
    console.error('OpenRouter API调用错误:', error)
    throw new Error('AI分析失败，请重试')
  }
}