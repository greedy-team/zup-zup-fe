import js from '@eslint/js';
import globals from 'globals';

import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

import tsParser from '@typescript-eslint/parser';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

const airbnbJs = compat.extends('airbnb', 'airbnb/hooks').map((cfg) => ({
  ...cfg,
  files: ['**/*.{js,jsx}'],
}));

const tsAirbnb = compat.extends('airbnb-typescript').map((cfg) => ({
  ...cfg,
  files: ['**/*.{ts,tsx}'],
}));

export default [
  { ignores: ['dist', 'node_modules', 'public/mockServiceWorker.js', 'eslint.config.js'] }
  {
    plugins: {
      react: reactPlugin,
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
  },

  ...airbnbJs,
  js.configs.recommended,
  ...tsAirbnb,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.browser,
      parser: tsParser,
      parserOptions: { project: ['./tsconfig.app.json'], tsconfigRootDir: __dirname },
    },
    settings: { 'import/resolver': { typescript: { project: ['./tsconfig.app.json'] } } },
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      '@typescript-eslint/indent': 'off',
      'no-empty': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'warn',

      'react/jsx-filename-extension': 'off',
      'react/function-component-definition': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/button-has-type': 'off',
      'react/self-closing-comp': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      'import/prefer-default-export': 'off',
      'import/extensions': 'off',
      'import/newline-after-import': 'off',
      'import/order': 'off',
      'import/no-duplicates': 'off',
      'import/no-useless-path-segments': 'off',

      'object-curly-newline': 'off',
      'operator-linebreak': 'off',
      'implicit-arrow-linebreak': 'off',
      'function-paren-newline': 'off',
      'spaced-comment': 'off',

      'max-len': [
        'warn',
        { code: 120, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreComments: true },
      ],
      'no-else-return': 'off',
      curly: 'off',
      'no-plusplus': 'off',
      'no-restricted-syntax': 'off',
      'no-console': 'off',

      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-throw-literal': 'off',
      '@typescript-eslint/naming-convention': 'off',

      'jsx-a11y/label-has-associated-control': 'off',
    },
  },
  {
    files: [
      'src/tests/**/*',
      'src/mocks/**/*',
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      'src/tests/setup.ts',
    ],
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'global-require': 'off',
      'import/first': 'off',
    },
  },

  {
    files: ['**/*.d.ts'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-undef': 'off',
      '@typescript-eslint/naming-convention': 'off',
    },
  },
  {
    files: ['vite.config.ts', 'vitest.config.ts', 'tailwind.config.*', 'postcss.config.*'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
      parser: tsParser,
      parserOptions: { project: ['./tsconfig.node.json'], tsconfigRootDir: __dirname },
    },
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
];
