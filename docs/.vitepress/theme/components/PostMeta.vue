<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import { normalizeCategorySlug, normalizeTagSlug } from '../../data/posts';

const props = defineProps<{
  date: string;
  categories: string[];
  tags: string[];
}>();

const categoryLinks = computed(() =>
  props.categories.map((category) => ({
    name: category,
    url: withBase(`/categories/${normalizeCategorySlug(category)}`)
  }))
);

const tagLinks = computed(() =>
  props.tags.map((tag) => ({
    name: tag,
    url: withBase(`/tags/${normalizeTagSlug(tag)}`)
  }))
);
</script>

<template>
  <dl class="post-meta">
    <div class="post-meta__group">
      <dt>发布于</dt>
      <dd>
        <time :datetime="date">{{ date }}</time>
      </dd>
    </div>

    <div v-if="categoryLinks.length" class="post-meta__group">
      <dt>分类</dt>
      <dd class="post-meta__list">
        <a
          v-for="category in categoryLinks"
          :key="category.url"
          class="post-meta__chip"
          :href="category.url"
        >
          {{ category.name }}
        </a>
      </dd>
    </div>

    <div v-if="tagLinks.length" class="post-meta__group">
      <dt>标签</dt>
      <dd class="post-meta__list">
        <a v-for="tag in tagLinks" :key="tag.url" class="post-meta__chip is-tag" :href="tag.url">
          # {{ tag.name }}
        </a>
      </dd>
    </div>
  </dl>
</template>
