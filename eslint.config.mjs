import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import globals from 'globals'

export default [
    {
        ...js.configs.recommended,
        languageOptions: {
            globals: globals.browser
        }
    },
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tsparser,
                sourceType: 'module'
            },
            globals: globals.browser
        },
        plugins: {
            vue
        },
        rules: {
            ...vue.configs['flat/recommended'].rules
        }
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsparser,
            sourceType: 'module',
            globals: globals.browser
        },
        plugins: {
            '@typescript-eslint': tseslint
        },
        rules: {
            ...tseslint.configs.recommended.rules
        }
    },
    {
        files: ['vite.config.*'],
        languageOptions: {
            globals: globals.node
        }
    }
]
