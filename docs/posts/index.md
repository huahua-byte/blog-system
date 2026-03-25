# Posts

这里用于存放博客文章内容。

## Frontmatter 规范

- 每篇文章都使用 YAML frontmatter，放在文件最开头，并用 `---` 包裹。
- 推荐字段顺序固定为：`title`、`date`、`categories`、`tags`、`pinned`、`draft`、`description`、`cover`。
- `title`：必填，`string`，文章标题。
- `date`：必填，`string`，使用 ISO 风格日期字符串，例如 `2026-03-25`。
- `categories`：必填，`string[]`，文章分类，至少保留一个分类。
- `tags`：必填，`string[]`，文章标签，可为空数组，但推荐填写。
- `pinned`：必填，`boolean`，是否置顶，必须写成 `true` 或 `false`，不要加引号。
- `draft`：必填，`boolean`，是否草稿，必须写成 `true` 或 `false`，不要加引号。
- `description`：必填，`string`，文章摘要，建议 1-2 句话。
- `cover`：必填，`string`，封面图路径，推荐使用 `public/` 下的绝对路径形式，例如 `/images/posts/example.svg`。

## 示例约定

- `categories` 和 `tags` 使用 YAML 数组，避免被解析为单个字符串。
- 布尔字段保持原生布尔值，避免写成 `'true'`、`'false'`。
- `cover` 只保存站点访问路径，不写本地文件系统路径。
- 正式文章使用 `draft: false`，未发布内容使用 `draft: true`。
- 需要在列表中优先展示的文章使用 `pinned: true`。

```yaml
---
title: 'VitePress 博客系统入门'
date: '2026-03-25'
categories:
  - '教程'
tags:
  - 'vitepress'
  - 'blog'
pinned: true
draft: false
description: '介绍博客文章目录、Frontmatter 写法与内容组织方式。'
cover: '/images/posts/vitepress-cover.svg'
---
```

## 示例文章

- [快速开始](./getting-started.md)：基础合法 frontmatter 示例。
- [版本发布说明](./release-notes.md)：多分类、多标签、置顶文章示例。
- [内容策划草稿](./content-planning.md)：草稿文章示例。
- [标签整理方法](./tag-collection.md)：单分类、多标签示例。
- [专题复盘：从文档站到博客](./case-study.md)：摘要与封面字段示例。

## 说明

- 新文章建议直接放在 `docs/posts/` 下。
- 主题增强和全局组件注册位于 `docs/.vitepress/theme/`。
