import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'blog-system',
  description: 'A VitePress-based blog system starter.',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Posts', link: '/posts/' }
    ],
    sidebar: [
      {
        text: 'Content',
        items: [
          { text: 'Overview', link: '/' },
          { text: 'Posts', link: '/posts/' }
        ]
      }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/' }]
  }
});
