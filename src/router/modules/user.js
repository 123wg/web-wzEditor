/**
* @Description: 测试用户路由
* @Author: wanggang
* @Date: 2021-09-13 23:04:15
* */
export default [
    {
        path: '/login',
        component: () => import('@/views/User.vue'),
        hidden: true,
    },
];
