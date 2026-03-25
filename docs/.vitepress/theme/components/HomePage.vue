<script setup lang="ts">
import { computed, ref } from 'vue';
import posts from '../../data/posts.data';
import { paginatePosts } from '../../data/posts';
import type { PostPage } from '../../types/post';
import PostCard from './PostCard.vue';

const PAGE_SIZE = 5;
const currentPage = ref(1);

const postPage = computed<PostPage>(() => paginatePosts(posts, currentPage.value, PAGE_SIZE));
const hasPreviousPage = computed(() => postPage.value.currentPage > 1);
const hasNextPage = computed(() => postPage.value.currentPage < postPage.value.totalPages);

function goToPreviousPage(): void {
  if (!hasPreviousPage.value) {
    return;
  }

  currentPage.value -= 1;
}

function goToNextPage(): void {
  if (!hasNextPage.value) {
    return;
  }

  currentPage.value += 1;
}
</script>

<template>
  <section class="home-page">
    <header class="home-page__hero">
      <p class="home-page__eyebrow">最新文章</p>
      <h1>博客首页</h1>
      <p class="home-page__intro">
        按置顶优先级与发布时间展示文章，支持分页浏览全部内容。
      </p>
    </header>

    <div v-if="postPage.items.length" class="home-page__list">
      <PostCard v-for="post in postPage.items" :key="post.slug" :post="post" />
    </div>

    <p v-else class="home-page__empty">当前暂无可展示的文章。</p>

    <nav class="home-pagination" aria-label="首页文章分页">
      <button
        type="button"
        class="home-pagination__button"
        :disabled="!hasPreviousPage"
        @click="goToPreviousPage"
      >
        上一页
      </button>

      <p class="home-pagination__status">
        第 {{ postPage.currentPage }} / {{ postPage.totalPages }} 页，共 {{ postPage.total }} 篇
      </p>

      <button
        type="button"
        class="home-pagination__button"
        :disabled="!hasNextPage"
        @click="goToNextPage"
      >
        下一页
      </button>
    </nav>
  </section>
</template>
