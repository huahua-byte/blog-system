import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import Layout from './Layout.vue';
import ArchivesPage from './components/ArchivesPage.vue';
import './style.css';

const theme = {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('ArchivesPage', ArchivesPage);
  }
} satisfies Theme;

export default theme;
