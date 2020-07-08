import Vue from 'vue'
import VueRouter from 'vue-router'
import Splash from '../views/Splash.vue'
import Game from '../views/Game'
import Tutorial from '../views/Tutorial.vue'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Splash',
        component: Splash
    },
    {
        path: '/tutorial',
        name: 'Tutorial',
        component: Tutorial
    },
    {
        path: '/play',
        name: 'Play',
        component: () => import('../views/Game')
    }
];

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
});

export default router
