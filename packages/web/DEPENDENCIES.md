# 简历解析功能所需依赖

为了实现完整的简历解析功能，需要添加以下依赖包：

## 必需依赖

```bash
# PDF文本提取
npm install pdf-parse

# DOC/DOCX文本提取  
npm install mammoth

# OpenAI API (用于AI文本分析)
npm install openai

# 文件类型检测
npm install file-type
```

## 可选依赖 (用于更高级的功能)

```bash
# 更强大的PDF解析
npm install pdf2pic

# 图像OCR (处理扫描版PDF)
npm install tesseract.js

# 更多文档格式支持
npm install node-pandoc
```

## 环境变量配置

在 `.env.local` 文件中添加：

```env
# OpenAI API密钥
OPENAI_API_KEY=your_openai_api_key_here

# 或者使用其他AI服务
CLAUDE_API_KEY=your_claude_api_key_here
```

## 安装命令

```bash
cd packages/web
npm install pdf-parse mammoth openai file-type
```

## 注意事项

1. **pdf-parse**: 用于提取PDF文本内容，支持大多数标准PDF格式
2. **mammoth**: 专门用于处理.docx文件，能够提取纯文本内容
3. **openai**: 提供AI文本分析能力，用于从简历文本中提取结构化信息
4. **file-type**: 更准确地检测文件类型，提高安全性

当前实现包含模拟数据，安装上述依赖后需要更新 `/api/parse-resume/route.ts` 中的相关函数以启用真实的文档解析功能。