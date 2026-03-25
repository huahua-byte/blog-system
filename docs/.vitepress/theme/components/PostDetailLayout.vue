<script setup lang="ts">
import { computed } from 'vue';
import { Content, useData, useRoute } from 'vitepress';
import posts from '../../data/posts.data';
import { getAdjacentPosts } from '../../data/posts';
import type { PostFrontmatter } from '../../types/post';
import PostMeta from './PostMeta.vue';
import PostPagination from './PostPagination.vue';
import PostToc from './PostToc.vue';

type TocItem = {
  title: string;
  link: string;
  children?: TocItem[];
};

const route = useRoute();
const { frontmatter, page, title } = useData();

const postFrontmatter = computed(() => frontmatter.value as PostFrontmatter);
const pageHeaders = computed<TocItem[]>(() => (page.value.headers ?? []) as TocItem[]);
const adjacentPosts = computed(() => getAdjacentPosts(posts, route.path));
</script>

<template>
  <article class="post-detail">
    <header class="post-detail__hero">
      <p class="post-detail__eyebrow">Article</p>
      <h1>{{ postFrontmatter.title || title }}</h1>
      <p v-if="postFrontmatter.description" class="post-detail__description">
        {{ postFrontmatter.description }}
      </p>
      <PostMeta
        :date="postFrontmatter.date"
        :categories="postFrontmatter.categories ?? []"
        :tags="postFrontmatter.tags ?? []"
      />
    </header>

    <div class="post-detail__body" :class="{ 'has-toc': pageHeaders.length > 0 }">
      <div class="post-detail__content">
        <Content />
      </div>

      <aside v-if="pageHeaders.length" class="post-detail__aside">
        <PostToc :headers="pageHeaders" />
      </aside>
    </div>

    <PostPagination
      :prev-post="adjacentPosts.prevPost"
      :next-post="adjacentPosts.nextPost"
    />
  </article>
</template>
