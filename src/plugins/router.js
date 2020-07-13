import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/play',
        name: 'Play',
        component: () => import('../views/Game')
    },
    {
        path: '/tutorial',
        name: 'Tutorial',
        component: () => import('../views/Tutorial')
    },
];

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
});

export default router
