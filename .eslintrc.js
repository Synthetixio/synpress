module.exports = {
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es2021: true,
    'cypress/globals': true,
  },
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:unicorn/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:cypress/recommended',
    'plugin:ui-testing/cypress',
    'plugin:testing-library/react',
  ],
  plugins: [
    'prettier',
    'unicorn',
    'import',
    'cypress',
    'chai-friendly',
    'ui-testing',
    'testing-library',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 12,
  },
  rules: {
    'no-debugger': 0,
    'no-console': 0,
    'unicorn/no-process-exit': 0,
  },
};
