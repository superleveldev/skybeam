module.exports = {
  arrowParens: 'always',
  printWidth: 80,
  trailingComma: 'all',
  proseWrap: 'always',
  singleQuote: true,
  semi: true,
  overrides: [
    {
      files: 'package*.json',
      options: {
        printWidth: 1000,
      },
    },
  ],
};
