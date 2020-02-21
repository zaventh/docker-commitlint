module.exports = {
  extends: [
    '@commitlint/config-conventional',
  ],
  plugins: [
    'tense',
  ],
  rules: {
    'imperative-tense': [2, 'always'],
    'scope-case': [0, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'sentence-case'],
  }
};
