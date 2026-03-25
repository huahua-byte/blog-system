export interface PostFrontmatter {
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  pinned: boolean;
  draft: boolean;
  description: string;
  cover: string;
}

export interface Post extends PostFrontmatter {
  url: string;
  slug: string;
  month: string;
}

export interface SearchDocument {
  title: string;
  description: string;
  content: string;
  url: string;
}

export interface PostArchiveGroup {
  month: string;
  label: string;
  posts: Post[];
  count: number;
}

export interface PostTagGroup {
  name: string;
  slug: string;
  posts: Post[];
  count: number;
}

export interface PostCategoryGroup {
  name: string;
  slug: string;
  posts: Post[];
  count: number;
}

export interface PostPage {
  items: Post[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface PostFilterOptions {
  category?: string;
  tag?: string;
  month?: string;
  isProduction?: boolean;
}
