import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import Layout from './Layout.vue';
import ArchivesPage from './components/ArchivesPage.vue';
import CategoriesPage from './components/CategoriesPage.vue';
import CategoryDetailPage from './components/CategoryDetailPage.vue';
import HomePage from './components/HomePage.vue';
import TagDetailPage from './components/TagDetailPage.vue';
import TagsPage from './components/TagsPage.vue';
import './style.css';

const theme = {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage);
    app.component('ArchivesPage', ArchivesPage);
    app.component('CategoriesPage', CategoriesPage);
    app.component('CategoryDetailPage', CategoryDetailPage);
    app.component('TagsPage', TagsPage);
    app.component('TagDetailPage', TagDetailPage);
  }
} satisfies Theme;

export default theme;
