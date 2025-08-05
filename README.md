# public-welfare-income-zk

零知识简历平台的monorepo项目架构

## 项目结构

```
resume_zk/
├── packages/
│   ├── web/               # Next.js 前端应用
│   ├── contracts/         # Foundry 智能合约
└── docs/                  # 文档
```

## 技术栈

### Frontend (packages/web/)
- **框架**: Next.js 14.1.0 + React 18 + TypeScript 5
- **UI组件库**: Shadcn UI + 共享UI组件
- **样式**: Tailwind CSS
- **状态管理**: Jotai
- **Web3**: wagmi + viem

### Smart Contracts (packages/contracts/)
- **开发框架**: Foundry
- **语言**: Solidity ^0.8.13

### 共享包
- **packages/ui/**: 可复用的UI组件库
- **packages/types/**: TypeScript类型定义
- **packages/utils/**: 通用工具函数

## 快速开始

### 1. 安装依赖

```bash
# 安装所有workspace的依赖
npm run install:all
```

### 2. 开发

```bash
# 启动前端开发服务器
npm run dev

# 构建智能合约
npm run contracts:build

# 运行智能合约测试
npm run contracts:test
```

### 3. 构建

```bash
# 构建前端应用
npm run build

# 构建智能合约
npm run contract:build
```

## 可用脚本

### 根目录脚本
- `npm run dev` - 启动前端开发服务器
- `npm run build` - 构建前端应用
- `npm run start` - 启动生产服务器
- `npm run test` - 运行所有测试
- `npm run clean` - 清理所有node_modules
- `npm run contracts:build` - 构建智能合约
- `npm run contracts:test` - 运行智能合约测试
- `npm run contracts:deploy` - 部署智能合约

### 前端 (packages/web/)
```bash
cd packages/web
npm run dev          # 开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
npm run type-check   # TypeScript 类型检查
```

### 智能合约 (packages/contracts/)
```bash
cd packages/contracts
npm run build        # 构建合约
npm run test         # 运行测试
npm run test:verbose # 详细测试输出
npm run coverage     # 测试覆盖率
npm run clean        # 清理构建文件
npm run fmt          # 格式化代码
npm run lint         # 代码检查
```

## 环境配置

1. 复制环境变量文件:
```bash
cp packages/web/.env.example packages/web/.env.local
cp packages/contracts/.env.example packages/contracts/.env
```

2. 配置必要的环境变量:
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - WalletConnect项目ID
- `PRIVATE_KEY` - 部署合约用的私钥
- `ETHERSCAN_API_KEY` - Etherscan API密钥

## 智能合约

主要合约 `ResumeZK.sol` 提供以下功能:
- 提交简历哈希和Merkle根
- 验证简历
- 查询用户简历
- 事件日志记录

## 开发指南

1. 遵循现有的代码风格和TypeScript类型声明
2. 使用Tailwind CSS进行样式开发
3. 利用Jotai进行状态管理
4. 智能合约开发遵循Solidity最佳实践
5. 编写相应的测试用例

## 部署

### 前端部署
前端应用可以部署到Vercel、Netlify等平台。

### 智能合约部署
