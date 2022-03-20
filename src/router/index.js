/**
* @Description: 路由入口
* @Author: wanggang
* @Date: 2021-09-12 22:06:40
* */

import { createRouter, createWebHistory } from 'vue-router';

// const modulesFiles = import.meta.globEager('./modules/*.js');
// export const constantRouterComponents = [];
// Object.keys(modulesFiles).forEach((path) => {
//     const value = modulesFiles[path].default;
//     constantRouterComponents.push(...value);
// });

// 异步路由引入
// console.log(constantRouterComponents);

const routes = [
    {
        path: '/editor',
        component: () => import('@/views/Editor.vue'),
    },
    {
        path: '/test',
        component: () => import('@/views/Test.vue'),
    },
    // FIXME 暂时注释
    // ...constantRouterComponents,
    {
        path: '/',
        component: () => import('@/views/Three.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(''),
    routes,
});

export default router;
