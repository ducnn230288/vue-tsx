module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['base']],
    'scope-empty': [2, 'never'],
  },
};
