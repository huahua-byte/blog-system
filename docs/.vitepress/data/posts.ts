import type { Post, PostArchiveGroup, PostFilterOptions, PostTagGroup } from '../types/post';
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
