<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Content, useData, useRoute, withBase } from 'vitepress';
import searchDocuments from '../data/search.data';
import type { SearchDocument } from '../types/post';
import PostDetailLayout from './components/PostDetailLayout.vue';

type NavItem = {
  text: string;
  link: string;
};

const { site, theme } = useData();
const route = useRoute();
const isNavOpen = ref(false);
const searchRoot = ref<HTMLElement | null>(null);
const searchQuery = ref('');
const isSearchOpen = ref(false);

const isPostDetailPage = computed(() => {
  const currentPath = normalizePath(route.path);
  return currentPath.startsWith('/posts/') && currentPath !== '/posts/';
});

const navItems = computed<NavItem[]>(() => {
  const nav = theme.value.nav;
  return Array.isArray(nav) ? (nav as NavItem[]) : [];
});

const normalizedQuery = computed(() => normalizeSearchText(searchQuery.value));
const searchTerms = computed(() => tokenizeQuery(normalizedQuery.value));

const searchResults = computed(() => {
  if (!searchTerms.value.length) {
    return [];
  }

  return searchDocuments
    .map((document) => scoreSearchDocument(document, searchTerms.value))
    .filter((result): result is SearchResult => result !== null)
    .sort((resultA, resultB) => resultB.score - resultA.score)
    .slice(0, 8);
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

function normalizeSearchText(value: string): string {
  return value.trim().toLocaleLowerCase('zh-Hans-CN');
}

function tokenizeQuery(value: string): string[] {
  return value
    .split(/\s+/u)
    .map((term) => term.trim())
    .filter(Boolean);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function findTermIndex(text: string, terms: string[]): number {
  const normalizedText = normalizeSearchText(text);
  let matchedIndex = -1;

  for (const term of terms) {
    const index = normalizedText.indexOf(term);

    if (index !== -1 && (matchedIndex === -1 || index < matchedIndex)) {
      matchedIndex = index;
    }
  }

  return matchedIndex;
}

function createSnippet(text: string, terms: string[]): string {
  const snippetRadius = 52;
  const matchIndex = findTermIndex(text, terms);

  if (matchIndex === -1) {
    return text.slice(0, 120).trim();
  }

  const start = Math.max(0, matchIndex - snippetRadius);
  const end = Math.min(text.length, matchIndex + snippetRadius + 36);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < text.length ? '...' : '';

  return `${prefix}${text.slice(start, end).trim()}${suffix}`;
}

function highlightText(text: string, terms: string[]): string {
  if (!text) {
    return '';
  }

  const uniqueTerms = Array.from(new Set(terms)).sort((termA, termB) => termB.length - termA.length);

  if (!uniqueTerms.length) {
    return escapeHtml(text);
  }

  const pattern = new RegExp(`(${uniqueTerms.map((term) => escapeRegExp(term)).join('|')})`, 'giu');

  return escapeHtml(text).replace(pattern, '<mark>$1</mark>');
}

type SearchResult = {
  document: SearchDocument;
  score: number;
  snippet: string;
};

function scoreSearchDocument(document: SearchDocument, terms: string[]): SearchResult | null {
  const title = normalizeSearchText(document.title);
  const description = normalizeSearchText(document.description);
  const content = normalizeSearchText(document.content);

  let score = 0;

  for (const term of terms) {
    if (title.includes(term)) {
      score += 12;
    }

    if (description.includes(term)) {
      score += 6;
    }

    if (content.includes(term)) {
      score += 4;
    }
  }

  if (score === 0) {
    return null;
  }

  return {
    document,
    score,
    snippet: createSnippet(document.content || document.description, terms)
  };
}

function openSearch(): void {
  isSearchOpen.value = true;
}

function clearSearch(): void {
  searchQuery.value = '';
  isSearchOpen.value = false;
}

function onSearchInput(): void {
  isSearchOpen.value = true;
}

function onSearchResultClick(): void {
  isSearchOpen.value = false;
}

function handleDocumentClick(event: MouseEvent): void {
  if (!(event.target instanceof Node)) {
    return;
  }

  if (!searchRoot.value?.contains(event.target)) {
    isSearchOpen.value = false;
  }
}

const footerYear: number = new Date().getFullYear();

watch(
  () => route.path,
  () => {
    isNavOpen.value = false;
    isSearchOpen.value = false;
  }
);

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick);
});
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <div class="site-header__inner">
        <a class="site-brand" :href="withBase('/')">
          <span class="site-brand__name">{{ site.title }}</span>
          <span class="site-brand__tagline">{{ site.description }}</span>
        </a>

        <div class="site-header__actions">
          <div ref="searchRoot" class="site-search" :class="{ 'is-open': isSearchOpen }">
            <label class="site-search__field" for="site-search-input">
              <span class="site-search__icon" aria-hidden="true">⌕</span>
              <input
                id="site-search-input"
                v-model="searchQuery"
                class="site-search__input"
                type="search"
                placeholder="搜索标题或正文"
                autocomplete="off"
                spellcheck="false"
                @focus="openSearch"
                @input="onSearchInput"
              >
              <button
                v-if="searchQuery"
                class="site-search__clear"
                type="button"
                aria-label="清空搜索"
                @click="clearSearch"
              >
                ×
              </button>
            </label>

            <div
              v-if="isSearchOpen && normalizedQuery"
              class="site-search__panel"
              role="listbox"
              aria-label="搜索结果"
            >
              <p class="site-search__summary">
                找到 {{ searchResults.length }} 条与 “{{ searchQuery.trim() }}” 相关的结果
              </p>

              <ul v-if="searchResults.length" class="site-search__results">
                <li v-for="result in searchResults" :key="result.document.url" class="site-search-result">
                  <a
                    class="site-search-result__link"
                    :href="withBase(result.document.url)"
                    @click="onSearchResultClick"
                  >
                    <strong
                      class="site-search-result__title"
                      v-html="highlightText(result.document.title, searchTerms)"
                    ></strong>
                    <p
                      class="site-search-result__snippet"
                      v-html="highlightText(result.snippet, searchTerms)"
                    ></p>
                  </a>
                </li>
              </ul>

              <p v-else class="site-search__empty">未找到匹配结果，请尝试更换关键词。</p>
            </div>
          </div>

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
      </div>
    </header>

    <main class="site-main">
      <div class="site-main__inner">
        <div class="site-content" :class="{ 'site-content--post': isPostDetailPage }">
          <PostDetailLayout v-if="isPostDetailPage" />
          <Content v-else />
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
