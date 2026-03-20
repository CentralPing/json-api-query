import js from '@eslint/js';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['node_modules/**', 'coverage/**']
  },

  {
    ...js.configs.recommended,
    files: ['**/*.js']
  },

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.nodeBuiltin,
        performance: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['error', {argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_'}],
      'no-use-before-define': ['error', {functions: false}],
      'no-param-reassign': ['error', {props: false}],
      'no-console': 'warn',
      'new-cap': 'off',
      'no-plusplus': 'off'
    }
  },

  prettierConfig
];
