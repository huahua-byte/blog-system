<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, withBase } from 'vitepress';
import posts from '../../data/posts.data';
import { getPostTagBySlug, normalizeTagSlug } from '../../data/posts';
import type { PostTagGroup } from '../../types/post';

const route = useRoute();

function resolveTagSlugFromPath(path: string): string {
  const normalizedPath = path
    .replace(/index\.html$/, '')
    .replace(/\.html$/, '')
    .replace(/\/+$/, '');
  const segments = normalizedPath.split('/').filter(Boolean);
  const tagSlug = segments.at(-1);

  return tagSlug ? normalizeTagSlug(decodeURIComponent(tagSlug)) : '';
}

const currentTag = computed<PostTagGroup | undefined>(() =>
  getPostTagBySlug(posts, resolveTagSlugFromPath(route.path))
);
</script>

<template>
  <section class="tag-detail-page">
    <header class="tag-detail-page__hero">
      <p class="tag-detail-page__eyebrow">标签详情</p>
      <h1>{{ currentTag ? `# ${currentTag.name}` : '标签未找到' }}</h1>
      <p class="tag-detail-page__intro">
        {{
          currentTag
            ? `共收录 ${currentTag.count} 篇文章，按发布时间与置顶优先级排序展示。`
            : '当前标签不存在，或该标签下暂无可展示的文章。'
        }}
      </p>
    </header>

    <ol v-if="currentTag?.posts.length" class="tag-detail-posts">
      <li v-for="post in currentTag.posts" :key="post.slug" class="archive-post">
        <time class="archive-post__date" :datetime="post.date">{{ post.date }}</time>
        <a class="archive-post__link" :href="withBase(post.url)">
          {{ post.title }}
        </a>
      </li>
    </ol>

    <p v-else class="tag-detail-empty">暂无文章可展示，返回标签页查看其他主题。</p>
  </section>
</template>
