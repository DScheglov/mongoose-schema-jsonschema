module.exports = {
    'env': {
        'commonjs': true,
        'es6': true,
        'node': true,
        "jest/globals": true
    },
    'extends': [
        'eslint:recommended',
        'airbnb-base'
    ],
    'plugins': ['jest'],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018
    },
    'rules': {
        'indent': [
            'error',
            2
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'global-require': 0,
        'no-underscore-dangle': 0,
        'import/order': 0,
        'camelcase': 0,
        'no-param-reassign': 0,
        'no-use-before-define': 0,
        'no-plusplus': 0,
        'no-restricted-syntax': 0,
        'no-continue': 0,
        'arrow-parens': ["error", "as-needed"],
        'no-mixed-operators': 0
    }
};