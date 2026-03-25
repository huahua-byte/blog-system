<script setup lang="ts">
type TocItem = {
  title: string;
  link: string;
  children?: TocItem[];
};

defineProps<{
  headers: TocItem[];
}>();
</script>

<template>
  <nav v-if="headers.length" class="post-toc" aria-label="文章目录">
    <p class="post-toc__title">目录</p>

    <ol class="post-toc__list">
      <li v-for="header in headers" :key="header.link" class="post-toc__item">
        <a class="post-toc__link" :href="header.link">{{ header.title }}</a>

        <ol v-if="header.children?.length" class="post-toc__children">
          <li v-for="child in header.children" :key="child.link" class="post-toc__item">
            <a class="post-toc__link is-child" :href="child.link">{{ child.title }}</a>
          </li>
        </ol>
      </li>
    </ol>
  </nav>
</template>
