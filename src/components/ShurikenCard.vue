<template>
    <div class="card hidden" v-if="hide"
         :style="`opacity: ${this.discarded ? 0 : 1}`">
    </div>
    <div title="Shuriken card" class="card" v-else :clickable="$listeners.hasOwnProperty('click')" @click="$emit('click')">
        <div class="top-number">
            <span>{{value}}</span>
            <span>{{value}}</span>
        </div>
        <div class="big-number">
            {{value}}
        </div>
        <div class="bottom-number">
            <span>{{value}}</span>
            <span>{{value}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ShurikenCard',
        props: {
            hide: {
                type: Boolean,
                default: false,
            },
            discarded: {
                type: Boolean,
                default: false,
            },
        },
        data: () => ({
            value:'🔪',
        }),
        mounted() {
        },
    }
</script>
<style scoped>
    .card {
        background-color: white;
        background-image: url("../assets/card-background.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        color: black;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 170px;
        width: 120px;
        min-width: 80px;
        box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.3);
        border-radius: 15px;
        transition: transform 0.2s, opacity 0.5s, width 0.5s, min-width 0.5s;
        text-align: center;
    }

    .card > * {
        pointer-events: none;
    }

    .card[clickable='true'] {
        cursor: pointer;
    }

    .card[clickable='true']:hover {
        transform: translateY(-15px);
    }

    .hidden {
        background-image: url("../assets/card-back.png");
    }

    .big-number {
        font-size: 45px;
        font-weight: bold;
        text-shadow: 0 0 20px white;
    }

    .bottom-number, .top-number {
        font-size: 18px;
        display: flex;
        justify-content: space-between;
        padding: 10px;
        color: white;
    }

    .bottom-number {
        transform: rotate(180deg);
    }
</style>
