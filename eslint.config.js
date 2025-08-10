import globals from 'globals';
import reactRefresh from 'eslint-plugin-react-refresh';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

export default [
  { ignores: ['dist'] },

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
  },

  ...compat.extends('airbnb', 'airbnb/hooks', 'airbnb-typescript'),

  reactRefresh.configs.vite,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      'import/resolver': { typescript: { project: ['./tsconfig.json'] } },
      react: { version: 'detect' },
    },
    rules: {
      'import/no-relative-parent-imports': 'error',
      'prefer-destructuring': ['error', { object: true, array: true }],
      'no-restricted-syntax': [
        'error',
        { selector: 'ForInStatement', message: 'for..in 금지' },
        { selector: 'LabeledStatement', message: 'label 금지' },
        { selector: 'WithStatement', message: 'with 금지' },
      ],
      'arrow-body-style': 'off',
    },
  },
];