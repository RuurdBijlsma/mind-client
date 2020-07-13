<template>
    <div class="mind-sync">
        <p class="explain-text">You must synchronize your mind to start the round</p>
        <div v-if="!visible" class="complete">
            ✔
        </div>
        <div v-if="visible" class="sync" @mousedown="startAnimation" @mouseup="endAnimation">
            <div class="finger">👇</div>
        </div>
        <p class="syncing-text">{{status}}</p>
    </div>
</template>

<script>
    export default {
        name: "MindSync",
        data: () => ({
            timeout: -1,
            visible: false,
            status: 'Syncing...',
        }),
        mounted() {
            this.visible = true;
            this.status = 'Syncing...';
        },
        methods: {
            startAnimation() {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.visible = false;
                    this.status = 'Synced!';
                    this.timeout = setTimeout(() => {
                        this.$emit('sync');
                    }, 700);
                }, 3000 * 0.95);
                //Animation is not visible at 90% of the 4 second animation, so emit sync at 95% of 4 second animation to be sure
            },
            endAnimation() {
                clearTimeout(this.timeout);
            },
        }
    }
</script>

<style scoped>
    .mind-sync {
        width: 480px;
        padding: 15px;
        border-radius: 15px;
        background-color: rgba(0, 0, 0, 0.3);
        text-align: center;
    }

    .explain-text {
        font-size: 25px;
        margin:10px;
    }

    .complete {
        font-size: 100px;
        color: lime;
        background-image: linear-gradient(to top, #000000 0%, #615b5b 100%) !important;
        border-radius: 50%;
        width: 250px;
        height: 250px;
        padding: 50px;
        margin: 100px;
        text-shadow: 0 0 40px lime;
        box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.3);
    }

    .syncing-text {
        font-size: 25px;
        margin-top: 20px;
        opacity: 0;
        transition: opacity 0.5s;
    }

    .sync:active ~ .syncing-text {
        opacity: 1;
    }

    .sync {
        width: 450px;
        height: 450px;
        background-image: linear-gradient(to top, #000000 0%, #615b5b 100%) !important;
        border-radius: 50%;
        box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.3);

        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.3s;

        perspective: 200px;
    }

    .sync:active {
        animation: changeColor 3s 1 linear;
    }

    @keyframes changeColor {
        0% {
            border: 0 solid white;
            box-shadow: 0 0 50px 10px white;
        }
        33% {
            border: calc(450px / 4) solid white;
            box-shadow: 0 0 150px 10px white;
            transform: scale(1);
        }
        70% {
            transform: scale(0.5);
            box-shadow: 0 0 0 0 white;
        }
        100% {
            border: calc(450px / 2) solid orangered;
            transform: scale(0.5);
        }
    }

    .finger {
        font-size: 200px;
        transform-style: preserve-3d;
        transition: transform 0.4s;
        transform: rotateX(0deg);
    }

    .sync:active .finger {
        animation: wiggleFinger 1s infinite linear;
    }

    @keyframes wiggleFinger {
        0% {
            transform: rotateX(45deg) translateY(-50px) scale(1.3) rotateY(0deg);
        }
        25% {
            transform: rotateX(45deg) translateY(-50px) scale(1.3) rotateY(-20deg);
        }
        75% {
            transform: rotateX(45deg) translateY(-50px) scale(1.3) rotateY(20deg);
        }
        100% {
            transform: rotateX(45deg) translateY(-50px) scale(1.3) rotateY(0deg);
        }
    }
</style>