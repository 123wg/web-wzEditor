module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        // TODO 插件暂时注释 好像没有什么卵用
        // 'plugin:vue/essential', // 现在不满足需求了
        // 'plugin:vue/vue3-recommended',
        // 'eslint:recommended',
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-essential',
    ],
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        'vue',
    ],
    rules: {
        'no-var': 'error',
        'vue/html-indent': ['error', 4],
        indent: ['error', 4],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 生产环境关闭console
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }], // 解决vite配置报错
        'import/no-unresolved': 'off', // https://blog.csdn.net/qq_42917144/article/details/117021528
        'vue/html-self-closing': 'off',
        'vue/comment-directive': 'off', // 解决html中eslint-disable的注释
        'no-param-reassign': ['error', { props: false }], // 修改函数参数
        'max-len': ['error', { code: 500 }],
        camelcase: 'off',
        'class-methods-use-this': 'off',
        'no-debugger': 'off',
        'consistent-return': 0,
        'no-underscore-dangle': 0,
        '@typescript-eslint/no-explicit-any': 0, // .ts 允许使用any
        '@typescript-eslint/ban-types': 0, // .ts 允许使用 Function 作用类型
        '@typescript-eslint/explicit-module-boundary-types': 0, // .ts 允许函数不写返回值类型
        '@typescript-eslint/no-this-alias': 0, // .ts 允许使用 this 别名
        '@typescript-eslint/no-extra-semi': 0, // .ts 允许额外分号
        'prefer-const': 0, // prefer-const 看官方文档
        'no-constant-condition': 0,
        '@typescript-eslint/no-empty-interface': 0,
        '@typescript-eslint/no-empty-function': 0,
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
    },
    globals: {
        wzEditor: true,
        turf: true,
    },
    settings: {
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'], // 配置文件扩展名
            },
            // 配置alias
            alias: {
                map: [
                    ['@', './src'],
                ],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
};
