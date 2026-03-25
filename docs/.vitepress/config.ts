import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'blog-system',
  description: 'A VitePress-based blog system starter.',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '分类', link: '/categories/' },
      { text: '标签', link: '/tags/' },
      { text: '归档', link: '/archives/' },
      { text: '关于', link: '/about/' }
    ],
    sidebar: false,
    socialLinks: [{ icon: 'github', link: 'https://github.com/' }]
  }
});
