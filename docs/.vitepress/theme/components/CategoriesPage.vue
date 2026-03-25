<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import posts from '../../data/posts.data';
import { getPostCategories } from '../../data/posts';
import type { PostCategoryGroup } from '../../types/post';

const categoryGroups = computed<PostCategoryGroup[]>(() => getPostCategories(posts));
</script>

<template>
  <section class="categories-page">
    <header class="categories-page__hero">
      <p class="categories-page__eyebrow">内容结构</p>
      <h1>分类浏览</h1>
      <p class="categories-page__intro">按分类查看文章集合，快速进入对应主题下的内容列表。</p>
    </header>

    <ul class="tags-cloud" aria-label="全部分类">
      <li v-for="group in categoryGroups" :key="group.slug" class="tags-cloud__item">
        <a class="tag-chip" :href="withBase(`/categories/${group.slug}`)">
          <span class="tag-chip__name">{{ group.name }}</span>
          <span class="tag-chip__count">{{ group.count }} 篇</span>
        </a>
      </li>
    </ul>
  </section>
</template>
