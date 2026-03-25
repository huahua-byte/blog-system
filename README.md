# blog-system

基于 VitePress 的博客系统初始化工程。

## 开发

```bash
npm install
npm run dev
```

默认本地开发地址为 `http://localhost:5173`。

## 构建

```bash
npm run build
npm run preview
```

## 目录结构

- `docs/`: VitePress 站点根目录
- `docs/posts/`: 博客文章目录
- `docs/.vitepress/theme/`: 主题扩展与增强入口
- `components/`: 预留共享组件目录
- `public/`: 静态资源目录

## 工程配置

- TypeScript 配置位于 `tsconfig.json`
- ESLint 配置位于 `eslint.config.js`
- 常用脚本定义位于 `package.json`
- VitePress 站点配置位于 `docs/.vitepress/config.ts`
