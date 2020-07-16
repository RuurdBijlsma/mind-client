<template>
    <div class="tutorial">
        <h1>The Mind - Settings</h1>
        <v-text-field v-model="url" label="Server URL"></v-text-field>
    </div>
</template>

<script>

    export default {
        name: 'Tutorial',
        data() {
            return {
                url: this.$store.state.url,
            }
        },
        components: {},
        watch: {
            url() {
                this.$store.commit('url', this.url);
            },
        },
    }
</script>
<style scoped>
    .tutorial {
        max-width: 900px;
        width: 100%;
        margin: 0 auto;
        padding: 30px;
    }

    .tutorial img {
        width: 100%;
    }

    .button {
        margin: 20px auto;
    }
</style>
