import globals from 'globals';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

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

  ...compat.extends('airbnb', 'airbnb/hooks', 'airbnb-typescript'),

  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.vite,

  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { project: './tsconfig.json' },
    },
    settings: {
      'import/resolver': { typescript: { project: ['./tsconfig.json'] } },
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
