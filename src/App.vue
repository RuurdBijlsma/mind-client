<template>
    <v-app class="app">
        <div class="navigation">
            <div>
                <v-btn text to="/">Home</v-btn>
            </div>
            <div>
                <v-btn text to="play">Play</v-btn>
            </div>
            <div>
                <v-btn text to="tutorial">Tutorial</v-btn>
            </div>
            <div>
                <v-btn text to="settings">Settings</v-btn>
            </div>
        </div>
        <router-view></router-view>
    </v-app>
</template>

<script>
    export default {
        name: 'App',
        data: () => ({
            tab: null,
        }),
        mounted() {
            // console.log("MOunted", this.$route);
            // if (this.$route.query.url) {
            //     console.log("Overwriting URL", this.$route.query.url);
            //     this.$store.commit('url', this.$route.query.url);
            // }
        }
    };
</script>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Piedra&display=swap');

    * {
        user-select: none;
    }

    .app {
        background-color: black;
        background-image: linear-gradient(to top, #000000 0%, #1461e5 59%, #903f0b 100%) !important;
    }

    .navigation {
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: center;
        padding: 5px;
    }

    .navigation > div {
        margin: 0 20px;
    }
</style>
