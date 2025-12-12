module.exports = {
  root: true,
  extends: ['@repo/eslint-config/nest'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
