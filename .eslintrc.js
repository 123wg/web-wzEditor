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
        'plugin:vue/vue3-essential',
        'airbnb-base',
        // '@vue/airbnb',
        // '@vue/airbnb',
        // 'airbnb'
    ],
    parserOptions: {
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
    },
    globals: {
        wzEditor: true,
    },
    settings: {
        'import/extensions': ['.js', '.jsx', 'ts', 'tsx'],
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
