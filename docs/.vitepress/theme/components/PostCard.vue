<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import { normalizeCategorySlug, normalizeTagSlug } from '../../data/posts';
import type { Post } from '../../types/post';

const props = defineProps<{
  post: Post;
}>();

const categoryLinks = computed(() =>
  props.post.categories.map((category) => ({
    name: category,
    url: withBase(`/categories/${normalizeCategorySlug(category)}`)
  }))
);

const tagLinks = computed(() =>
  props.post.tags.map((tag) => ({
    name: tag,
    url: withBase(`/tags/${normalizeTagSlug(tag)}`)
  }))
);
</script>

<template>
  <article class="post-card">
    <div class="post-card__header">
      <span v-if="post.pinned" class="post-card__badge">置顶</span>
      <time class="post-card__date" :datetime="post.date">{{ post.date }}</time>
    </div>

    <h2 class="post-card__title">
      <a :href="withBase(post.url)">{{ post.title }}</a>
    </h2>

    <div v-if="categoryLinks.length || tagLinks.length" class="post-card__meta">
      <div v-if="categoryLinks.length" class="post-card__meta-group">
        <span class="post-card__meta-label">分类</span>
        <div class="post-card__meta-list">
          <a
            v-for="category in categoryLinks"
            :key="category.url"
            class="post-card__chip"
            :href="category.url"
          >
            {{ category.name }}
          </a>
        </div>
      </div>

      <div v-if="tagLinks.length" class="post-card__meta-group">
        <span class="post-card__meta-label">标签</span>
        <div class="post-card__meta-list">
          <a v-for="tag in tagLinks" :key="tag.url" class="post-card__chip is-tag" :href="tag.url">
            # {{ tag.name }}
          </a>
        </div>
      </div>
    </div>

    <p class="post-card__description">{{ post.description }}</p>
  </article>
</template>
