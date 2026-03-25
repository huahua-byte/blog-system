---
title: '快速开始'
date: '2026-03-20'
categories:
  - '教程'
tags:
  - 'vitepress'
  - '入门'
pinned: false
draft: false
description: '从目录结构、写作流程到本地预览，快速建立第一篇博客文章。'
cover: '/images/posts/getting-started.svg'
---

# 快速开始

这篇文章演示一篇标准公开文章应当如何编写 frontmatter 和正文内容。

## 第一步

在 `docs/posts/` 下创建新的 Markdown 文件，并将 frontmatter 放在文件最顶部。

### 字段顺序建议

- 先写 `title` 和 `date`。
- 再补齐 `categories`、`tags`。
- 最后填写 `description` 和 `cover`。

## 第二步

为文章补齐分类、标签、摘要和封面路径，保持字段顺序统一，便于维护和检查。

### 一次性检查项

1. 布尔字段使用原生 `true` 或 `false`。
2. 标签与分类保持数组格式。
3. 摘要直接概括正文重点。

## 第三步

运行 `npm run dev` 或 `npm run build`，确认 VitePress 可以正常解析页面。

### 预览时重点看什么

可以重点确认标题层级、列表样式和代码块是否按预期渲染：

```bash
npm run dev
```
