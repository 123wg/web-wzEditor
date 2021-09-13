/**
* @Description: 路由入口
* @Author: wanggang
* @Date: 2021-09-12 22:06:40
* */

import { createRouter, createWebHistory } from 'vue-router';

const modulesFiles = import.meta.globEager('./modules/*.js');
export const constantRouterComponents = [];
Object.keys(modulesFiles).forEach((path) => {
    const value = modulesFiles[path].default;
    console.log(value);
    constantRouterComponents.push(...value);
    // Object.keys(value).forEach((ele) => {
    //     constantRouterComponents[ele] = value[ele];
    // });
});

// 异步路由引入
console.log(constantRouterComponents);

const routes = [
    {
        path: '/',
        component: () => import('@/components/HelloWorld.vue'),
    },
    ...constantRouterComponents,
];

const router = createRouter({
    // process.env.BASE_URL
    history: createWebHistory(''),
    routes,
});

export default router;
