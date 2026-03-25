import { createContentLoader } from 'vitepress';
import type { ContentData } from 'vitepress';
import type { Post, PostFrontmatter } from '../types/post';

const DEFAULT_IS_PRODUCTION = process.env.NODE_ENV === 'production';

type RawPostContent = ContentData & {
  frontmatter: PostFrontmatter;
  srcPath?: string;
};

function resolveSlug(raw: RawPostContent): string {
  if (raw.srcPath) {
    return raw.srcPath
      .replace(/^.*\/posts\//, '')
      .replace(/\.md$/, '');
  }

  return raw.url
    .replace(/^\/posts\//, '')
    .replace(/\.html$/, '')
    .replace(/\/$/, '');
}

export function normalizePost(raw: RawPostContent): Post {
  const slug = resolveSlug(raw);
  const url = `/posts/${slug}`;

  return {
    ...raw.frontmatter,
    slug,
    url,
    month: raw.frontmatter.date.slice(0, 7)
  };
}

export function comparePosts(a: Post, b: Post): number {
  if (a.pinned !== b.pinned) {
    return a.pinned ? -1 : 1;
  }

  return b.date.localeCompare(a.date);
}

export function shouldIncludePost(post: Post, isProduction: boolean): boolean {
  if (isProduction && post.draft) {
    return false;
  }

  return true;
}

const postsLoader = createContentLoader('posts/*.md', {
  excerpt: false,
  transform(rawPosts) {
    return rawPosts
      .map((rawPost) => normalizePost(rawPost as RawPostContent))
      .filter((post) => shouldIncludePost(post, DEFAULT_IS_PRODUCTION))
      .sort(comparePosts);
  }
});

export default postsLoader;
