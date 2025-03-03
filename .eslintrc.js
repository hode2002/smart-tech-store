module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'import', 'prettier'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules', 'coverage'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-empty-function': 'warn',
        '@typescript-eslint/no-inferrable-types': 'warn',
        '@typescript-eslint/no-var-requires': 'warn',
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],
        'import/order': [
            'error',
            {
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    ['parent', 'sibling'],
                    'index',
                    'object',
                    'type',
                ],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],
        'sort-imports': [
            'error',
            {
                ignoreCase: true,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false,
            },
        ],
        'import/no-unresolved': 'off',
        'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
        'max-len': [
            'warn',
            { code: 100, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true },
        ],
        quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
        semi: ['error', 'always'],
        eqeqeq: ['error', 'always'],
        curly: ['error', 'all'],
        'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
        'no-trailing-spaces': 'error',
        'comma-dangle': ['error', 'always-multiline'],
    },
    settings: {
        'import/resolver': {
            typescript: {},
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
};
