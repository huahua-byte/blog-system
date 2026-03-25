import { createContentLoader } from 'vitepress';
import type { ContentData } from 'vitepress';
import type { PostFrontmatter, SearchDocument } from '../types/post';
import { shouldIncludePost } from './posts.data';

const DEFAULT_IS_PRODUCTION = process.env.NODE_ENV === 'production';

type RawSearchContent = ContentData & {
  frontmatter: PostFrontmatter;
  src?: string;
  srcPath?: string;
};

function stripFrontmatter(source: string): string {
  return source.replace(/^---[\s\S]*?---\s*/u, '');
}

function stripMarkdown(source: string): string {
  return source
    .replace(/```[\s\S]*?```/gu, ' ')
    .replace(/`([^`]+)`/gu, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/gu, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, '$1')
    .replace(/^#{1,6}\s+/gmu, '')
    .replace(/^\s*>\s?/gmu, '')
    .replace(/^\s*[-*+]\s+/gmu, '')
    .replace(/^\s*\d+\.\s+/gmu, '')
    .replace(/\|/gu, ' ')
    .replace(/[*_~]/gu, '')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

function resolveSlug(raw: RawSearchContent): string {
  if (raw.srcPath) {
    return raw.srcPath
      .replace(/^.*\/posts\//u, '')
      .replace(/\.md$/u, '');
  }

  return raw.url
    .replace(/^\/posts\//u, '')
    .replace(/\.html$/u, '')
    .replace(/\/$/u, '');
}

function normalizeSearchDocument(raw: RawSearchContent): SearchDocument {
  const slug = resolveSlug(raw);
  const content = stripMarkdown(stripFrontmatter(raw.src ?? ''));

  return {
    title: raw.frontmatter.title,
    description: raw.frontmatter.description,
    content,
    url: `/posts/${slug}`
  };
}

const searchLoader = createContentLoader('posts/*.md', {
  includeSrc: true,
  transform(rawPosts) {
    return rawPosts
      .filter((rawPost) =>
        shouldIncludePost((rawPost as RawSearchContent).frontmatter, DEFAULT_IS_PRODUCTION)
      )
      .map((rawPost) => normalizeSearchDocument(rawPost as RawSearchContent));
  }
});

export default searchLoader;
