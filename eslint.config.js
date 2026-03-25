import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['docs/.vitepress/dist/**', 'node_modules/**']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['docs/.vitepress/**/*.ts', 'components/**/*.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  }
);
