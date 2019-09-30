module.exports = {
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'airbnb-base'
    ],
    plugins: ['@typescript-eslint'],
    parser: '@typescript-eslint/parser',
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        '@typescript-eslint/explicit-function-return-type': ['warn', {
            allowTypedFunctionExpressions: true,
            allowExpressions: true,
        }],
    }
};
