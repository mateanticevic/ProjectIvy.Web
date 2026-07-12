import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default defineConfig([
    {
        ignores: [
            '**/ivy-types.ts',
            'dist/**',
        ],
    },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            globals: globals.browser,
            parser: typescriptParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            react,
            '@typescript-eslint': typescriptEslint,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...typescriptEslint.configs.recommended.rules,
            '@typescript-eslint/explicit-module-boundary-types': 0,
            indent: [
                'error',
                4,
            ],
            'linebreak-style': [
                'error',
                'unix',
            ],
            quotes: [
                'error',
                'single',
            ],
            semi: [
                'error',
                'always',
            ],
            'react/display-name': 0,
        },
    },
]);