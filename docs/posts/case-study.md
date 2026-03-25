---
title: '专题复盘：从文档站到博客'
date: '2026-03-24'
categories:
  - '案例'
tags:
  - 'case-study'
  - 'migration'
  - 'content-design'
pinned: false
draft: false
description: '通过一次站点演进复盘，展示 description 与 cover 字段的推荐写法，以及如何为文章补充更完整的上下文。'
cover: '/images/posts/case-study.svg'
---

# 专题复盘：从文档站到博客

当站点从单纯的文档展示演进为博客系统后，frontmatter 会承担更多内容组织职责。

## 为什么需要摘要

`description` 可以服务文章列表、SEO 描述和卡片预览，因此应当直接概括文章核心信息。

### 摘要应该回答什么

- 这篇文章讲什么。
- 读完能获得什么。
- 为什么值得点开。

## 为什么需要封面

`cover` 适合统一管理文章视觉入口，推荐使用 `public/images/posts/` 下的静态资源路径。

### 封面资源如何组织

建议按文章 slug 存放，例如 `/images/posts/case-study.svg`，这样在迁移或批量替换时更稳定。

## 结果

只要字段格式稳定，后续无论做归档、分类还是推荐位，数据结构都更容易复用。

### 延伸收益

当站点继续增加相关文章、专题页或推荐模块时，这套结构可以直接复用，而不用再从 Markdown 正文里反推元数据。
