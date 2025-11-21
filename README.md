# Sales Champion Guard (智能销售后卫)

基于 Next.js + Dify 的销售实时辅助与复盘系统 (MVP v1.0)。

## ✨ 功能特性

*   **实战模式 (Combat Console)**:
    *   S0-S5 标准销售流程状态机
    *   实时阻碍诊断与战术话术推荐
    *   支持 Dify Chat API 对接
    *   离线兜底模式 (Fallback)
*   **复盘模式 (Review Lab)**:
    *   上传聊天截图进行视觉诊断
    *   自动评分与阶段分析
    *   错误话术 vs 冠军建议对比
    *   前端图片自动压缩
*   **技术栈**:
    *   Framework: Next.js 14 (App Router)
    *   Language: TypeScript
    *   Styling: Tailwind CSS
    *   AI Backend: Dify (Chat & Workflow)

## 🚀 快速开始

### 1. 环境准备
确保本地已安装 Node.js (v18+) 和 npm/yarn/pnpm。

### 2. 安装依赖
```bash
cd sales-guard
npm install
```

### 3. 配置环境变量
复制示例文件并填入你的 Dify API Key：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`:
```env
# Dify API Base URL (SaaS or Self-hosted)
DIFY_API_URL=https://api.dify.ai/v1

# 实战模式 (Chat App) API Key
DIFY_API_KEY_COMBAT=app-xxxxxxxxxxxx

# 复盘模式 (Workflow App) API Key
DIFY_API_KEY_REVIEW=app-yyyyyyyyyyyy
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 即可使用。

## 📂 目录结构

```
src/
├── app/
│   ├── api/            # Next.js API Routes (Dify Proxy)
│   ├── review/         # 复盘模式页面
│   └── page.tsx        # 实战模式主页 (Combat Console)
├── components/         # UI 组件 (TacticalCard, TriggerMatrix...)
├── data/               # 本地配置 (config.json - 兜底话术)
├── lib/                # 工具库 (dify.ts - API Client)
└── types/              # TypeScript 类型定义
```

## 🛠 开发指南

*   **修改话术**: 编辑 `src/data/config.json` 可直接更新前端显示的阻碍按钮和离线兜底话术。
*   **调整 Prompt**: 请在 Dify 平台调整 Agent/Workflow 的 System Prompt，前端会自动适配返回的 JSON 结构。
*   **部署**: 项目适配 Vercel 部署，直接导入 Git 仓库即可。记得在 Vercel Dashboard 设置环境变量。

## 📝 License
Private / Proprietary
