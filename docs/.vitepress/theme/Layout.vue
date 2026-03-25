<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Content, useData, useRoute, withBase } from 'vitepress';

type NavItem = {
  text: string;
  link: string;
};

const { site, theme } = useData();
const route = useRoute();
const isNavOpen = ref(false);

const navItems = computed<NavItem[]>(() => {
  const nav = theme.value.nav;
  return Array.isArray(nav) ? (nav as NavItem[]) : [];
});

function normalizePath(path: string): string {
  if (!path) {
    return '/';
  }

  const normalized = path.replace(/index\.html$/, '');
  const withLeadingSlash = normalized.startsWith('/') ? normalized : `/${normalized}`;
  const trimmed = withLeadingSlash.replace(/\/+$/, '');

  return trimmed === '' ? '/' : `${trimmed}/`.replace(/\/+$/, '/');
}

function isActive(link: string): boolean {
  const currentPath = normalizePath(route.path);
  const targetPath = normalizePath(link);

  if (targetPath === '/') {
    return currentPath === '/';
  }

  return currentPath === targetPath || currentPath.startsWith(targetPath);
}

const footerYear: number = new Date().getFullYear();

watch(
  () => route.path,
  () => {
    isNavOpen.value = false;
  }
);
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <div class="site-header__inner">
        <a class="site-brand" :href="withBase('/')">
          <span class="site-brand__name">{{ site.title }}</span>
          <span class="site-brand__tagline">{{ site.description }}</span>
        </a>

        <button
          class="site-nav-toggle"
          type="button"
          :aria-expanded="String(isNavOpen)"
          aria-controls="site-nav"
          aria-label="Toggle navigation"
          @click="isNavOpen = !isNavOpen"
        >
          <span class="site-nav-toggle__bar" />
          <span class="site-nav-toggle__bar" />
          <span class="site-nav-toggle__bar" />
        </button>

        <nav id="site-nav" class="site-nav" :class="{ 'is-open': isNavOpen }" aria-label="Global">
          <a
            v-for="item in navItems"
            :key="item.link"
            class="site-nav__link"
            :class="{ 'is-active': isActive(item.link) }"
            :href="withBase(item.link)"
          >
            {{ item.text }}
          </a>
        </nav>
      </div>
    </header>

    <main class="site-main">
      <div class="site-main__inner">
        <div class="site-content">
          <Content />
        </div>
      </div>
    </main>

    <footer class="site-footer">
      <div class="site-footer__inner">
        <p class="site-footer__title">{{ site.title }}</p>
        <p class="site-footer__meta">Built with VitePress. © {{ footerYear }}</p>
      </div>
    </footer>
  </div>
</template>
