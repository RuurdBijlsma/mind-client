<template>
    <div class="home">
        <h1>The Mind</h1>
        <div class="container">
            <div @click="$router.push('/play')">
                <mind-card class="show-card" :hide="true"></mind-card>
                <p>Play the game!</p>
            </div>
            <div @click="$router.push('/tutorial')">
                <shuriken-card class="show-card"></shuriken-card>
                <p>Game tutorial</p>
            </div>
        </div>
    </div>
</template>

<script>

    import MindCard from "../components/MindCard";
    import ShurikenCard from "../components/ShurikenCard";

    export default {
        name: 'Home',
        data() {
            return {
                hello: 'world',
            }
        },
        components: {ShurikenCard, MindCard}
    }
</script>
<style scoped>
    .home {
        width: 100%;
        height: 100%;
        text-align: center;
    }

    .container {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .container div {
        cursor: pointer;
        margin:5px;
        /*transform: scale(1.5);*/
    }

    .show-card {
        width: 190px;
        height: 280px;
    }

    .container > div > p {
        font-size: 20px;
        padding: 10px;
    }
</style>
