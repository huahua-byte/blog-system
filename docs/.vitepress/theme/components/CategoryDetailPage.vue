<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, withBase } from 'vitepress';
import posts from '../../data/posts.data';
import { getPostCategoryBySlug, normalizeCategorySlug } from '../../data/posts';
import type { PostCategoryGroup } from '../../types/post';

const route = useRoute();

function resolveCategorySlugFromPath(path: string): string {
  const normalizedPath = path
    .replace(/index\.html$/, '')
    .replace(/\.html$/, '')
    .replace(/\/+$/, '');
  const segments = normalizedPath.split('/').filter(Boolean);
  const categorySlug = segments.at(-1);

  return categorySlug ? normalizeCategorySlug(decodeURIComponent(categorySlug)) : '';
}

const currentCategory = computed<PostCategoryGroup | undefined>(() =>
  getPostCategoryBySlug(posts, resolveCategorySlugFromPath(route.path))
);
</script>

<template>
  <section class="category-detail-page">
    <header class="category-detail-page__hero">
      <p class="category-detail-page__eyebrow">分类详情</p>
      <h1>{{ currentCategory ? currentCategory.name : '分类未找到' }}</h1>
      <p class="category-detail-page__intro">
        {{
          currentCategory
            ? currentCategory.posts.length
              ? `共收录 ${currentCategory.count} 篇文章，按发布时间与置顶优先级排序展示。`
              : '当前分类已创建，但暂时还没有可展示的文章。'
            : '当前分类不存在，或该分类下暂无可展示的文章。'
        }}
      </p>
    </header>

    <ol v-if="currentCategory?.posts.length" class="tag-detail-posts">
      <li v-for="post in currentCategory.posts" :key="post.slug" class="archive-post">
        <time class="archive-post__date" :datetime="post.date">{{ post.date }}</time>
        <a class="archive-post__link" :href="withBase(post.url)">
          {{ post.title }}
        </a>
      </li>
    </ol>

    <p v-else class="tag-detail-empty">暂无文章可展示，返回分类页查看其他内容分组。</p>
  </section>
</template>
