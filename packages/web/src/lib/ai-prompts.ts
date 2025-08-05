// AI 提示词模板

export const RESUME_ANALYSIS_PROMPT = `
你是一个专业的简历分析助手。请从以下简历文本中提取结构化信息，严格按照JSON格式返回。

简历文本：
{RESUME_TEXT}

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

export const SKILLS_EXTRACTION_PROMPT = `
从以下简历文本中提取所有技术技能，包括编程语言、框架、工具、数据库等：

{RESUME_TEXT}

请返回一个字符串数组，只包含技术相关的技能：
["技能1", "技能2", "技能3"]
`

export const EDUCATION_EXTRACTION_PROMPT = `
从以下简历文本中提取教育背景信息：

{RESUME_TEXT}

请返回JSON格式的教育信息：
{
  "degree": "学位名称",
  "university": "学校名称", 
  "graduationYear": "毕业年份",
  "major": "专业名称"
}
`

export const EXPERIENCE_EXTRACTION_PROMPT = `
从以下简历文本中提取工作经历信息：

{RESUME_TEXT}

请返回JSON数组格式的工作经历：
[
  {
    "company": "公司名称",
    "position": "职位名称",
    "duration": "工作时间段",
    "description": "工作描述"
  }
]
`