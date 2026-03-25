import type {
  Post,
  PostArchiveGroup,
  PostCategoryGroup,
  PostFilterOptions,
  PostPage,
  PostTagGroup
} from '../types/post';
import { comparePosts, shouldIncludePost } from './posts.data';

const DEFAULT_IS_PRODUCTION = process.env.NODE_ENV === 'production';

function formatArchiveLabel(month: string): string {
  const [year, value] = month.split('-');

  if (!year || !value) {
    return month;
  }

  return `${year} 年 ${value} 月`;
}

function normalizeTagName(tag: string): string {
  return tag.trim().replace(/\s+/g, ' ');
}

export function normalizeTagSlug(tag: string): string {
  return encodeURIComponent(normalizeTagName(tag).toLowerCase().replace(/\s+/g, '-'));
}

function normalizeCategoryName(category: string): string {
  return category.trim().replace(/\s+/g, ' ');
}

export function normalizeCategorySlug(category: string): string {
  return encodeURIComponent(normalizeCategoryName(category).toLowerCase().replace(/\s+/g, '-'));
}

function matchesCategory(post: Post, category?: string): boolean {
  if (!category) {
    return true;
  }

  return post.categories.includes(category);
}

function matchesTag(post: Post, tag?: string): boolean {
  if (!tag) {
    return true;
  }

  return post.tags.includes(tag);
}

function matchesMonth(post: Post, month?: string): boolean {
  if (!month) {
    return true;
  }

  return post.month === month;
}

function normalizePostUrl(url: string): string {
  if (!url) {
    return '/';
  }

  const withoutIndex = url.replace(/index\.html$/, '');
  const withoutExtension = withoutIndex.replace(/\.html$/, '');
  const withLeadingSlash = withoutExtension.startsWith('/') ? withoutExtension : `/${withoutExtension}`;
  const trimmed = withLeadingSlash.replace(/\/+$/, '');

  return trimmed === '' ? '/' : trimmed;
}

export function getAllPosts(posts: Post[], options: PostFilterOptions = {}): Post[] {
  const {
    category,
    tag,
    month,
    isProduction = DEFAULT_IS_PRODUCTION
  } = options;

  return posts
    .filter((post) => shouldIncludePost(post, isProduction))
    .filter((post) => matchesCategory(post, category))
    .filter((post) => matchesTag(post, tag))
    .filter((post) => matchesMonth(post, month))
    .sort(comparePosts);
}

export function getPostsByCategory(
  posts: Post[],
  category: string,
  options: Pick<PostFilterOptions, 'isProduction'> = {}
): Post[] {
  return getAllPosts(posts, { ...options, category });
}

export function getPostsByTag(
  posts: Post[],
  tag: string,
  options: Pick<PostFilterOptions, 'isProduction'> = {}
): Post[] {
  return getAllPosts(posts, { ...options, tag });
}

export function getPostCategories(
  posts: Post[],
  options: Pick<PostFilterOptions, 'isProduction'> = {}
): PostCategoryGroup[] {
  const groupedPosts = new Map<string, PostCategoryGroup>();

  for (const post of getAllPosts(posts, options)) {
    for (const rawCategory of post.categories) {
      const name = normalizeCategoryName(rawCategory);

      if (!name) {
        continue;
      }

      const existingGroup = groupedPosts.get(name);

      if (existingGroup) {
        existingGroup.posts.push(post);
        existingGroup.count += 1;
        continue;
      }

      groupedPosts.set(name, {
        name,
        slug: normalizeCategorySlug(name),
        posts: [post],
        count: 1
      });
    }
  }

  return Array.from(groupedPosts.values())
    .map((group) => ({
      ...group,
      posts: group.posts.sort(comparePosts)
    }))
    .sort((groupA, groupB) => {
      if (groupA.count !== groupB.count) {
        return groupB.count - groupA.count;
      }

      return groupA.name.localeCompare(groupB.name, 'zh-Hans-CN');
    });
}

export function getPostCategoryBySlug(
  posts: Post[],
  slug: string,
  options: Pick<PostFilterOptions, 'isProduction'> = {}
): PostCategoryGroup | undefined {
  return getPostCategories(posts, options).find((group) => group.slug === slug);
}

export function getPostTags(
  posts: Post[],
  options: Pick<PostFilterOptions, 'isProduction'> = {}
): PostTagGroup[] {
  const groupedPosts = new Map<string, PostTagGroup>();

  for (const post of getAllPosts(posts, options)) {
    for (const rawTag of post.tags) {
      const name = normalizeTagName(rawTag);

      if (!name) {
        continue;
      }

      const existingGroup = groupedPosts.get(name);

      if (existingGroup) {
        existingGroup.posts.push(post);
        existingGroup.count += 1;
        continue;
      }

      groupedPosts.set(name, {
        name,
        slug: normalizeTagSlug(name),
        posts: [post],
        count: 1
      });
    }
  }

  return Array.from(groupedPosts.values())
    .map((group) => ({
      ...group,
      posts: group.posts.sort(comparePosts)
    }))
    .sort((groupA, groupB) => {
      if (groupA.count !== groupB.count) {
        return groupB.count - groupA.count;
      }

      return groupA.name.localeCompare(groupB.name, 'zh-Hans-CN');
    });
}

export function getPostTagBySlug(
  posts: Post[],
  slug: string,
  options: Pick<PostFilterOptions, 'isProduction'> = {}
): PostTagGroup | undefined {
  return getPostTags(posts, options).find((group) => group.slug === slug);
}

export function getPostsByMonth(
  posts: Post[],
  month: string,
  options: Pick<PostFilterOptions, 'isProduction'> = {}
): Post[] {
  return getAllPosts(posts, { ...options, month });
}

export function paginatePosts(
  posts: Post[],
  page: number,
  pageSize: number,
  options: Pick<PostFilterOptions, 'isProduction'> = {}
): PostPage {
  const visiblePosts = getAllPosts(posts, options);
  const normalizedPageSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 1;
  const total = visiblePosts.length;
  const totalPages = Math.max(1, Math.ceil(total / normalizedPageSize));
  const requestedPage = Number.isFinite(page) ? Math.floor(page) : 1;
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
  const startIndex = (currentPage - 1) * normalizedPageSize;

  return {
    items: visiblePosts.slice(startIndex, startIndex + normalizedPageSize),
    total,
    totalPages,
    currentPage,
    pageSize: normalizedPageSize
  };
}

export function getAdjacentPosts(
  posts: Post[],
  currentUrl: string,
  options: Pick<PostFilterOptions, 'isProduction'> = {}
): { prevPost: Post | null; nextPost: Post | null } {
  const visiblePosts = getAllPosts(posts, options);
  const currentIndex = visiblePosts.findIndex(
    (post) => normalizePostUrl(post.url) === normalizePostUrl(currentUrl)
  );

  if (currentIndex === -1) {
    return {
      prevPost: null,
      nextPost: null
    };
  }

  return {
    prevPost: visiblePosts[currentIndex - 1] ?? null,
    nextPost: visiblePosts[currentIndex + 1] ?? null
  };
}

export function getPostArchives(
  posts: Post[],
  options: Pick<PostFilterOptions, 'isProduction'> = {}
): PostArchiveGroup[] {
  const groupedPosts = new Map<string, Post[]>();

  for (const post of getAllPosts(posts, options)) {
    const archivePosts = groupedPosts.get(post.month);

    if (archivePosts) {
      archivePosts.push(post);
      continue;
    }

    groupedPosts.set(post.month, [post]);
  }

  return Array.from(groupedPosts.entries())
    .sort(([monthA], [monthB]) => monthB.localeCompare(monthA))
    .map(([month, archivePosts]) => ({
      month,
      label: formatArchiveLabel(month),
      posts: archivePosts.sort(comparePosts),
      count: archivePosts.length
    }));
}
