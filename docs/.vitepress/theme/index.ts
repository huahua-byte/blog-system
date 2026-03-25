import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import Layout from './Layout.vue';
import ArchivesPage from './components/ArchivesPage.vue';
import TagDetailPage from './components/TagDetailPage.vue';
import TagsPage from './components/TagsPage.vue';
import './style.css';

const theme = {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('ArchivesPage', ArchivesPage);
    app.component('TagsPage', TagsPage);
    app.component('TagDetailPage', TagDetailPage);
  }
} satisfies Theme;

export default theme;
