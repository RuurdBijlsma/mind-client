<template>
    <div class="card hidden" v-if="hide">
    </div>
    <div class="card" v-else :clickable="$listeners.hasOwnProperty('click')" @click="$emit('click')">
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
        name: 'MindCard',
        props: {
            value: {
                type: Number,
                default: 0,
            },
            hide: {
                type: Boolean,
                default: false,
            },
            clickable: {
                type: Boolean,
                default: false,
            },
        },
        data: () => ({}),
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
        height: 210px;
        width: 150px;
        min-width: 100px;
        box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.3);
        border-radius: 15px;
        transition: transform 0.2s;
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
        font-size: 60px;
        font-weight: bold;
        text-shadow: 0 0 20px white;
    }

    .bottom-number, .top-number {
        font-size: 20px;
        display: flex;
        justify-content: space-between;
        padding: 10px;
        color: white;
    }

    .bottom-number {
        transform: rotate(180deg);
    }
</style>
