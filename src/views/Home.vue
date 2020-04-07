<template>
    <div class="home">
        <h1>Home Page {{hello}}</h1>
    </div>
</template>

<script>

    export default {
        name: 'Home',
        data(){
            return{
                hello: 'world',
            }
        },
        components: {}
    }
</script>
<style scoped>

</style>
