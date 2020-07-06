<template>
    <v-app>
        <router-view>
            <transition name ="view"></transition>
        </router-view>
    </v-app>
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
    .view-enter-active, .view-leave-active{
        transition: opacity 0.5s ease-in-out, transform 0.5s ease;
    }
    .view-enter, .view-leave-to{
        opacity: 0;
    }

</style>
