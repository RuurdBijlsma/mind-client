<template>
    <div class="card hidden" v-if="hide">
    </div>
    <div class="card star" v-else-if="star" :clickable="$listeners.hasOwnProperty('click')" @click="$emit('click')">
    </div>
    <div class="card life" v-else-if="life">
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
            star: {
                type: String,
                default: false,
            },
            life: {
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
        height: 15vh;
        width: 5vw;
        min-width: 10vh;
        box-shadow: 0 0.4rem 1rem 0 rgba(0, 0, 0, 0.3);
        border-radius: 1rem;
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
        transform: translateY(-1.0em);
    }

    .hidden {
        background-image: url("../assets/card-back.png");
    }

    .star {
        background-image: url("../assets/card-star.png");
    }

    .life {
        background-image: url("../assets/card-life.png");
    }

    .displaystar {
        /* font-size: 60px;
        font-weight: bold;
        text-shadow: 0 0 2em white;
        left:50%; */
    }

    .big-number {
        font-size: 1rem;
        font-weight: bold;
        text-shadow: 0 0 0.5rem white;
    }

    .bottom-number, .top-number {
        font-size: 0.5rem;
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        color: white;
    }

    .bottom-number {
        transform: rotate(180deg);
    }
</style>
