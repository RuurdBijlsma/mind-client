import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Splash',
        component: () => import('../views/Splash')
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/Home')
    },
    {
        path: '/play',
        name: 'Play',
        component: () => import('../views/Game')
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
