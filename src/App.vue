<template>
    <div id="app">
        <div id="nav">
            <router-link to="/play">Game</router-link> | 
            <router-link to="/tutorial">Tutorial</router-link>
        </div>
        <v-app>
            <transition name ="view">
                <router-view/>
            </transition>
        </v-app>
    </div>
</template>

<script>

    export default {
        name: 'App',
        components: {},
        data: () => ({

        }),
    };
</script>

<style>
    *{
        user-select: none;
    }
    .view-enter-active {
    transition: opacity 0.5s ease-in-out, transform 0.6s ease, transition-delay 0.1s;
    }

    .view-leave-active {
        transition: opacity 0.5s ease-in-out, transform 5s ease, transition-delay 0.1s;
    }
    .view-enter {
    opacity: 0;
    transform: translateX(-100px);
    transition-delay: 5s;
    }
    .view-enter-to {
    opacity: 1;
    transform: translateX(0px);
    }
    .view-leave {
    opacity: 1;
    transform: translateY(0px);
    }

    .view-leave-to {
    opacity: 0;
    transform: translateX(-100px);
    transition-duration: 0.05s;
    }

    body {
    margin: 0;
    padding: 0;
    background-image: linear-gradient(to top, #000000 0%, #1461e5 59%, #903f0b 100%);
    }

    .theme--light.v-application {
        background :none !important;
    }

    #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #a6d2ff;
    }

    #nav {
    padding: 30px;
    }

    #nav a {
    color: #2c3e50;
    font-size: 20px;
    text-decoration: none;
    }

    #nav a.router-link-exact-active {
    color: #ffce00;
    }
    
    /* .page {
    display: block;
    margin: 0 auto;
    width: 100%;
    max-width: 768px;
    padding: 1500px;
    box-sizing: border-box;
    } */

</style>
