module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['prettier', '@typescript-eslint/eslint-plugin'],
    extends: [
        'expo',
        'prettier',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'prettier/prettier': [
            'warn',
            {
                tabWidth: 4,
                printWidth: 80,
            },
        ],
    },
};
