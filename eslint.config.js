// Configuration document: https://eslint.nodejs.cn/
import js from '@eslint/js';
import pluginTypeScript from '@typescript-eslint/eslint-plugin';
import * as parserTypeScript from '@typescript-eslint/parser';
import configPrettier from 'eslint-config-prettier';
import { defineFlatConfig } from 'eslint-define-config';
import pluginCasePolice from 'eslint-plugin-case-police';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginSonarjs from 'eslint-plugin-sonarjs';
import pluginVue from 'eslint-plugin-vue';
import * as parserVue from 'vue-eslint-parser';

/** @type {import('eslint-define-config').FlatESLintConfig} */
export default defineFlatConfig([
  {
    ...js.configs.recommended,
    ignores: ['src/assets/**', 'build'],
    plugins: {
      prettier: pluginPrettier,
      sonarjs: pluginSonarjs,
      'case-police': pluginCasePolice,
    },
    settings: {
      react: {
        version: '18', // setting to eslint-plugin-sonarjs
      },
    },
    rules: {
      ...configPrettier.rules,
      ...pluginPrettier.configs.recommended.rules,
      ...pluginSonarjs.configs.recommended.rules,
      ...pluginCasePolice.configs.recommended.rules,
      /*
       * Eslint rule configuration
       */
      // Require let or const instead of var
      'no-var': 'error',
      // Disallow using variables before defining them
      'no-use-before-define': 'off',
      // Variables that are never reassigned after declaration require a const declaration
      'prefer-const': 'error',
      // Disallow irregular spaces
      'no-irregular-whitespace': 'off',
      // Disable debugger usage
      'no-debugger': 'off',
      // Disallow unused variables
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      // Using the prettier plugin
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],

      // Sonarlint
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/no-nested-template-literals': 'off',
      'sonarjs/no-vue-bypass-sanitization': 'off',
    },
  },
  {
    files: ['**/*.?([cm])ts', '**/*.?([cm])tsx'],
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        jsxPragma: 'React',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': pluginTypeScript,
    },
    rules: {
      ...pluginTypeScript.configs.recommended.rules,
      /*
       * TypeScript rule configuration
       */
      // Infer types of parameters, properties, and variables based on their default or initial values
      '@typescript-eslint/no-inferrable-types': 'off',
      // Disallow custom ts modules and namespaces
      '@typescript-eslint/no-namespace': 'off',
      // Disallow any type
      '@typescript-eslint/no-explicit-any': 'off',
      // Disallowing certain types
      '@typescript-eslint/ban-types': 'off',
      // Explicit return type declarations are not allowed for variables or parameters initialized to numbers, strings, or Boolean values
      '@typescript-eslint/explicit-function-return-type': 'off',
      // Do not allow require statements within import statements
      '@typescript-eslint/no-var-requires': 'off',
      // Disallow empty functions
      '@typescript-eslint/no-empty-function': 'off',
      // Disallow using variables before they are defined
      '@typescript-eslint/no-use-before-define': 'off',
      // Disallow @ts-<directive> comment code
      '@typescript-eslint/ban-ts-comment': 'off',
      // Non-null assertions using postfix operators (!) are not allowed
      '@typescript-eslint/no-non-null-assertion': 'off',
      // Require explicit return and parameter types for exported functions and public class methods of classes
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // Importing with the top-level type qualifier
      '@typescript-eslint/no-import-type-side-effects': 'error',
      // Non-null assertion is not allowed after optional chaining expression
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      // Disallow definition of unused variables
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      // Allow specifying the type keyword on imports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: false,
          fixStyle: 'inline-type-imports',
        },
      ],
      // Allows enumeration member values ​​to be valid JS expressions of different types
      '@typescript-eslint/prefer-literal-enum-member': [
        'error',
        {
          allowBitwiseExpressions: true,
        },
      ],
    },
  },
  {
    files: ['*.d.ts'],
    rules: {
      'eslint-comments/no-unlimited-disable': 'off',
      'import/no-duplicates': 'off',
      'unused-imports/no-unused-vars': 'off',
    },
  },
  {
    files: ['*.?([cm])js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module',
        jsxPragma: 'React',
        ecmaFeatures: {
          jsx: true,
        },
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue: pluginVue,
    },
    processor: pluginVue.processors['.vue'],
    rules: {
      ...pluginVue.configs.base.rules,
      ...pluginVue.configs['vue3-essential'].rules,
      ...pluginVue.configs['vue3-recommended'].rules,
      /*
       * Vue rule configuration
       * Configuration Document: https://eslint.vuejs.org/rules/)
       */
      // Disallow unused variable definitions in v-for directives or scope properties
      'vue/no-unused-vars': 'off',
      // Disable V-HTML to prevent XSS attacks
      'vue/no-v-html': 'off',
      // Disable enforcing order of attributes
      'vue/attributes-order': 'off',
      // Disallowing required default values ​​for props
      'vue/require-default-prop': 'off',
      // Disables the requirement that each component be in its own file
      'vue/one-component-per-file': 'off',
      // Disallow side effects in computed properties
      'vue/no-side-effects-in-computed-properties': 'off',
      // Disallow use of reserved names in component definitions
      'vue/no-reserved-component-names': 'off',
      // Disable enforcing property naming style on custom components in templates
      'vue/attribute-hyphenation': 'off',
      // Disable the requirement that component names always be multiple letters
      'vue/multi-word-component-names': 'off',
      // Disable enforcement of a maximum number of attributes per row
      'vue/max-attributes-per-line': 'off',
      // Disallow requiring line breaks before and after the content of single-line elements
      'vue/singleline-html-element-content-newline': 'off',
      // Disable enforcing element self-closing
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
    },
  },
]);
