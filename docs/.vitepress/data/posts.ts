import type { Post, PostArchiveGroup, PostFilterOptions } from '../types/post';
import { comparePosts, shouldIncludePost } from './posts.data';

const DEFAULT_IS_PRODUCTION = process.env.NODE_ENV === 'production';

function formatArchiveLabel(month: string): string {
  const [year, value] = month.split('-');

  if (!year || !value) {
    return month;
  }

  return `${year} 年 ${value} 月`;
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

export function getPostsByMonth(
  posts: Post[],
  month: string,
  options: Pick<PostFilterOptions, 'isProduction'> = {}
): Post[] {
  return getAllPosts(posts, { ...options, month });
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
