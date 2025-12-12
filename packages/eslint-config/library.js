module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'turbo',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
