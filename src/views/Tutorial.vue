<template>
    <div class="tutorial">
        <h1>Tutorial {{hello}}</h1>
        <router-link to="play">Play</router-link>
        <mind-sync></mind-sync>
    </div>
</template>

<script>

    import MindSync from "../components/MindSync";
    export default {
        name: 'Tutorial',
        data() {
            return {
                hello: 'world',
            }
        },
        components: {MindSync}
    }
</script>
<style scoped>

</style>
