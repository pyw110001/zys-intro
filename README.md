# ZYS INTRO

数字艺术与智能建造工作室（Z-LAB）官方介绍站点。基于 React + Vite + Three.js，包含 Three.js 粒子光影背景、业务介绍、演示文稿浏览与 AI 咨询助手。

## 功能

- 沉浸式 Hero 首屏与滚动视差
- Three.js 动态粒子星场背景
- 四大核心业务展示
- 业务介绍幻灯片交互浏览
- LUMI AI 咨询（需配置 Gemini API Key）

## 本地运行

**环境要求：** Node.js 18+

```bash
npm install
```

在 `.env.local` 中配置（可选，用于 AI 聊天）：

```
GEMINI_API_KEY=your_api_key_here
```

启动开发服务器（端口 4050）：

```bash
npm run dev
```

浏览器访问：http://localhost:4050/

## 构建

```bash
npm run build
npm run preview
```

## 技术栈

- React 19 + TypeScript
- Vite 6
- Tailwind CSS
- Framer Motion
- Three.js

## License

Private studio project — see repository for usage terms.
