<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import posts from '../../data/posts.data';
import { getPostTags } from '../../data/posts';
import type { PostTagGroup } from '../../types/post';

const tagGroups = computed<PostTagGroup[]>(() => getPostTags(posts));
</script>

<template>
  <section class="tags-page">
    <header class="tags-page__hero">
      <p class="tags-page__eyebrow">主题导航</p>
      <h1>标签浏览</h1>
      <p class="tags-page__intro">按主题查看相关文章，快速跳转到对应标签下的内容列表。</p>
    </header>

    <ul class="tags-cloud" aria-label="全部标签">
      <li v-for="group in tagGroups" :key="group.slug" class="tags-cloud__item">
        <a class="tag-chip" :href="withBase(`/tags/${group.slug}`)">
          <span class="tag-chip__name">{{ group.name }}</span>
          <span class="tag-chip__count">{{ group.count }} 篇</span>
        </a>
      </li>
    </ul>
  </section>
</template>
