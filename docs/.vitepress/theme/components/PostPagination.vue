<script setup lang="ts">
import { withBase } from 'vitepress';
import type { Post } from '../../types/post';

defineProps<{
  prevPost: Post | null;
  nextPost: Post | null;
}>();
</script>

<template>
  <nav v-if="prevPost || nextPost" class="post-pagination" aria-label="文章分页导航">
    <a v-if="prevPost" class="post-pagination__link" :href="withBase(prevPost.url)">
      <span class="post-pagination__eyebrow">上一篇</span>
      <strong>{{ prevPost.title }}</strong>
      <time :datetime="prevPost.date">{{ prevPost.date }}</time>
    </a>

    <a v-if="nextPost" class="post-pagination__link is-next" :href="withBase(nextPost.url)">
      <span class="post-pagination__eyebrow">下一篇</span>
      <strong>{{ nextPost.title }}</strong>
      <time :datetime="nextPost.date">{{ nextPost.date }}</time>
    </a>
  </nav>
</template>
