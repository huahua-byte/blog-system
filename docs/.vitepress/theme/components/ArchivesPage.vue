<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import posts from '../../data/posts.data';
import { getPostArchives } from '../../data/posts';
import type { PostArchiveGroup } from '../../types/post';

const archiveGroups = computed<PostArchiveGroup[]>(() => getPostArchives(posts));
</script>

<template>
  <section class="archives-page">
    <header class="archives-page__hero">
      <p class="archives-page__eyebrow">时间线</p>
      <h1>文章归档</h1>
      <p class="archives-page__intro">按年月查看已发布文章，快速跳转到对应内容。</p>
    </header>

    <div class="archives-timeline">
      <section
        v-for="group in archiveGroups"
        :key="group.month"
        class="archive-group"
        :aria-labelledby="`archive-group-${group.month}`"
      >
        <div class="archive-group__header">
          <h2 :id="`archive-group-${group.month}`" class="archive-group__title">
            {{ group.label }}
          </h2>
          <span class="archive-group__count">{{ group.count }} 篇</span>
        </div>

        <ol class="archive-posts">
          <li v-for="post in group.posts" :key="post.slug" class="archive-post">
            <time class="archive-post__date" :datetime="post.date">{{ post.date }}</time>
            <a class="archive-post__link" :href="withBase(post.url)">
              {{ post.title }}
            </a>
          </li>
        </ol>
      </section>
    </div>
  </section>
</template>
