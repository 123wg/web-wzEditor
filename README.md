## 框架问题
- 完善stylelint 校验
- eslint校验完善 --采用最严格的代码规范校验
- vuex分包管理 命名空间
- 增加代码提交规范校验

## 编辑器
- 禁用vulture 使用 volar
- 括号配对着色(Bracket Pair Colorizer) 插件
- 卸载 Vue VSCode Snippets 使用 Vue3 Snippets
```
    解决别名报错问题 
    https://www.jianshu.com/p/f3f03fa9ab42
    // "eslint-import-resolver-alias": "^1.1.2",
        // settings: {
    //     'import/extensions': ['.js', '.jsx', 'ts', 'tsx'],
    //     'import/resolver': {
    //         node: {
    //             extensions: ['.js', '.jsx', '.ts', '.tsx'], // 配置文件扩展名
    //         },
    //         // 配置alias
    //         alias: {
    //             map: [
    //                 ['@', './src'],
    //             ],
    //             extensions: ['.js', '.jsx', '.ts', '.tsx'],
    //         },
    //     },
    // },
```
