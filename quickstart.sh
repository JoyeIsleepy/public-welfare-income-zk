#!/bin/bash

echo "🚀 Resume ZK Monorepo 快速启动脚本"
echo "=================================="

# 1. 安装依赖
echo "📦 安装项目依赖..."
pnpm install

# 2. 复制环境变量模板
echo "🔧 设置环境变量..."
cp packages/web/.env.example packages/web/.env.local
cp packages/contracts/.env.example packages/contracts/.env

# 3. 构建智能合约
echo "🔨 构建智能合约..."
pnpm run contracts:build

# 4. 运行智能合约测试
echo "✅ 运行合约测试..."
pnpm run contracts:test

# 5. 启动前端开发服务器
echo "🌐 前端准备就绪..."
echo ""
echo "🎉 项目初始化完成！"
echo ""
echo "下一步："
echo "1. 编辑 packages/web/.env.local 配置环境变量"
echo "2. 编辑 packages/contracts/.env 配置部署密钥"
echo "3. 运行 'pnpm run dev' 启动开发服务器"
echo ""
echo "可用命令："
echo "- pnpm run dev             # 启动前端开发"
echo "- pnpm run contracts:test  # 测试智能合约"
echo "- pnpm run build           # 构建前端"
echo "- pnpm run web:dev         # 启动前端(明确指定)"
echo "- pnpm run contracts:build # 构建合约"