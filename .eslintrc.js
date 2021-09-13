module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        // 'plugin:vue/essential', // 现在不满足需求了
        'plugin:vue/vue3-recommended',
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        'vue',
    ],
    rules: {
        indent: ['error', 4],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 生产环境关闭console
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }], // 解决vite配置报错
        'import/no-unresolved': 'off', // https://blog.csdn.net/qq_42917144/article/details/117021528
    },
};
