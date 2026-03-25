import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import Layout from './Layout.vue';
import './style.css';

const theme = {
  extends: DefaultTheme,
  Layout,
  enhanceApp() {
    // Reserved for future global component registration.
  }
} satisfies Theme;

export default theme;
