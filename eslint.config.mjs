import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const config = [
  // Base JS recommended rules
  js.configs.recommended,
  
  // Next.js and TypeScript integration
  ...compat.extends('next/core-web-vitals'),
  
  // Custom settings
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        React: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      // Add custom rules here
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  
  // Prettier integration (must be last to override other configs)
  prettierConfig,
  
  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'build/**',
      'public/**',
      '**/*.d.ts',
      '.yarn/**',
      '.vercel/**',
      'src/graphql/generated-types/**',
      'ecosystem.config.js',
    ],
  },
];

export default config;
