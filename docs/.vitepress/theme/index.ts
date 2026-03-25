import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';

const theme = {
  extends: DefaultTheme,
  enhanceApp() {
    // Reserved for future global component registration.
  }
} satisfies Theme;

export default theme;
