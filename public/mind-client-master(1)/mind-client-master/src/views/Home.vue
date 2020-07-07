<template>
    <div class="home">
        <h1>Home Page {{hello}}</h1>
        <router-link to="play">Play</router-link>
    </div>
</template>

<script>

    export default {
        name: 'Home',
        data() {
            return {
                hello: 'world',
            }
        },
        components: {}
    }
</script>
<style scoped>

</style>
