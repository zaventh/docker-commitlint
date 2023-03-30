module.exports = {
    extends: [
        '@commitlint/config-conventional',
    ],
    plugins: [
        'tense',
    ],
    rules: {
        'imperative-tense': [2, 'always'],
    }
};
