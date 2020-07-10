<template>
    <div class="game">
        <div class="field">
            <div class="playing-field">
                <div v-if="players[1]" class="computer cards">
                    <p v-if="players[1].hand.length===0">The computer has no cards left</p>
                    <mind-card v-for="card in players[1].hand" :key="card" :hide="!modelRevealedCards.includes(card)"
                               :value="card"
                               :style="`
                                opacity: ${discardedCards.includes(card)?'0':'1'};
                                transform: translateY(${discardedCards.includes(card)?'200px':'0'});
                               `">
                    </mind-card>
                </div>
                <div class="middle-section">
                    <div class="deck" ref="deck">
                        <mind-card v-for="(card, i) in deck" :value="card"
                                   :style="`top: ${i*40}px; transform: translateX(${Math.round(Math.random()*20)}px)`"
                                   :key="card"></mind-card>
                    </div>
                </div>
                <div v-if="players[0]" class="human cards">
                    <p v-if="players[0].hand.length===0">You have no cards left</p>
                    <mind-card v-for="card in players[0].hand" :key="card" @click="playCard(players[0], card)"
                               :value="card"
                               :style="`
                                opacity: ${discardedCards.includes(card)?'0':'1'};
                                transform: translateY(${discardedCards.includes(card)?'-200px':'0'});
                               `">
                    </mind-card>
                </div>
            </div>
            <div class="bottom-bar">
                <div class="game-actions">
                    <v-btn @click="nextRound" v-if="nextRoundReady" color="primary">Next Round</v-btn>
                    <v-btn @click="newGame(2, true)">New Game</v-btn>
                </div>
                <div class="game-info">
                    <p>Round: {{round}}</p>
                    <p>Shurikens: {{shurikens}}
                        <v-btn @click="proposeShuriken" outlined
                               v-if="shurikens>0 && !nextRoundReady && !dead && models[0].hand.length > 0">
                            Propose
                        </v-btn>
                    </p>
                    <p>Lives: {{lives}}</p>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import io from "socket.io-client";
    import Player from "../js/Player";
    import MindCard from "../components/MindCard";
    import Swal from 'sweetalert2'

    // Todo:
    // More game functionality
    // Model play all cards when opponent hand is empty
    // Tell model whether it was successful in playing the card
    // Add server to hpserver

    // Show what can be gained this round (lives/shurikens) (maybe after round is complete)

    export default {
        name: 'Game',
        components: {MindCard},
        data: () => ({
            debug: true,
            socket: null,
            debugEvents: [],
            players: [],
            models: [],
            human: null,
            deck: [],
            round: 0,
            lives: -1,
            shurikens: -1,
            playTimeouts: [],
            nextRoundReady: false,
            //This means after completing round 2 you get 1 life
            roundBonuses: {
                2: {lives: 1},
                3: {shurikens: 1},
            },
            modelRevealedCards: [],
            discardedCards: [],
        }),
        mounted() {
            const url = 'http://localhost:5000';
            this.socket = io(url);
            console.log('Server starting:', this.socket);
            this.setSocketListeners();
            this.newGame(2)
        },
        beforeDestroy() {
            this.socket.destroy()
        },
        methods: {
            async newGame(players, prompt = false) {
                if (prompt && !(await Swal.fire({
                    title: 'Are you sure you want to start a new game?',
                    text: "All progress will be lost!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, new game!'
                })).value) return;
                this.human = new Player('human', false);
                this.players = [];
                this.models = [];
                this.players.push(this.human);
                for (let i = 0; i < players - 1; i++) {
                    let computerPlayer = new Player('model' + (i + 1), true);
                    this.players.push(computerPlayer);
                    this.models.push(computerPlayer);
                }
                this.lives = 2;
                this.shurikens = 1;
                this.socket.emit('new_game');
                this.newRound(3);
            },
            nextRound() {
                this.newRound(this.round + 1);
            },
            newRound(roundNumber) {
                this.modelRevealedCards = [];
                this.discardedCards = [];
                this.nextRoundReady = false;
                this.round = roundNumber;
                this.deck = [];
                const deckSize = 100;
                let allCards = this.shuffle([...new Array(deckSize)].map((_, i) => i + 1));
                for (let player of this.players) {
                    player.hand = allCards.splice(0, roundNumber);
                    console.log(player.hand)
                    player.hand = player.hand.sort((a, b) => a - b);
                }
                this.socket.emit('new_round', this.models[0].hand);
            },
            async disappearCard(player, card) {
                return new Promise(resolve => {
                    this.discardedCards.push(card);
                    setTimeout(() => {
                        let index = player.hand.indexOf(card);
                        console.log('disappearing', index, card, 'from', player.hand);
                        player.hand.splice(index, 1);
                        resolve();
                    }, 500);
                });
            },
            async discardCard(player, card, loseLife = true) {
                if (this.dead)
                    return false;
                if (!player.hand.includes(card))
                    return console.warn("Player", player, "tried to [DISCARD] card", card, "but it's not in their hand");

                await this.disappearCard(player, card);

                if (loseLife) {
                    this.lives--;
                    this.socket.emit('life_lost', player === this.human);
                    if (this.dead) {
                        for (let timeout of this.playTimeouts)
                            clearTimeout(timeout)
                        await Swal.fire({
                            title: "You died one too many times",
                            text: "You reached round " + this.round,
                            icon: "error",
                            confirmButtonText: '😢',
                        });
                        return;
                    }
                }
                if (!this.dead)
                    await this.checkWin();
            },
            async playCard(player, card) {
                if (this.dead)
                    return false;
                if (!player.hand.includes(card))
                    return console.warn("Player", player, "tried to [PLAY] card", card, "but it's not in their hand");

                // Remove life if mistake was made
                if (card < this.topCard) {
                    await this.discardCard(player, card);
                    return;
                }
                if (card > this.topCard)
                    this.socket.emit('life_not_lost');

                // if (this.human.hand.length === 0) {
                //     let i = 0;
                //     for (let card of this.models[0].hand) {
                //         this.playTimeouts.push(setTimeout(async () => {
                //             await this.playCard(this.models[0], card);
                //         }, ++i * 300));
                //     }
                //     this.playTimeouts.push(setTimeout(async () => {
                //         this.socket.emit('update_model_hand', this.models[0].hand);
                //     }, i * 300));
                // }

                if (player === this.human) {
                    this.socket.emit('card_played', card);
                } else {
                    // this.socket.emit('update_top_card', card)
                }

                await this.disappearCard(player, card);
                this.deck.push(card);
                setTimeout(() => {
                    if (this.$refs.deck)
                        this.$refs.deck.scroll(0, this.$refs.deck.scrollHeight);
                }, 50);

                await this.checkWin();
            },
            async checkWin() {
                if (this.players.every(player => player.hand.length === 0)) {
                    this.socket.emit('end_round', this.round);
                    if (this.round === 12) {
                        await Swal.fire({
                            title: "You win!",
                            icon: "success",
                            confirmButtonText: '😃',
                        });
                    } else {
                        let bonuses = this.roundBonuses[this.round];
                        if (bonuses) {
                            let bonusText;
                            if (bonuses.lives && bonuses.shurikens)
                                bonusText = `For completing round ${this.round} you get a bonus life and a bonus shuriken!`;
                            else if (bonuses.lives)
                                bonusText = `For completing round ${this.round} you get a bonus life!`;
                            else if (bonuses.shurikens)
                                bonusText = `For completing round ${this.round} you get a bonus shuriken!`;
                            if (bonusText)
                                await Swal.fire({
                                    title: bonusText,
                                    icon: "success",
                                    confirmButtonText: '😃',
                                });
                            if (bonuses.lives) {
                                this.lives += bonuses.lives;
                                this.socket.emit('get_life', bonuses.lives)
                            }
                            if (bonuses.shurikens) {
                                this.shurikens += bonuses.shurikens;
                                this.socket.emit('get_shuriken', bonuses.shurikens)
                            }
                        }
                        this.nextRoundReady = true;
                    }
                }
            },
            playAllLowerCards() {
                let i = 0;
                for (let player of this.players) {
                    for (let card of player.hand) {
                        if (card < this.topCard) {
                            console.log("[play all lower cards]", card)
                            this.playTimeouts.push(setTimeout(async () => {
                                await this.playCard(player, card, true);
                            }, ++i * 300))
                        }
                    }
                }
            },
            proposeShuriken() {
                this.socket.emit('shuriken_proposed');
            },
            activateShuriken() {
                this.shurikens--;
                console.log("Human lowest card:", this.human.hand[0], "model lowest card", this.models[0].hand[0])
                this.socket.emit('reveal_lowest_card', this.human.hand[0]);
                this.modelRevealedCards.push(this.models[0].hand[0]);
            },
            shuffle(input) {
                for (let i = input.length - 1; i >= 0; i--) {

                    const randomIndex = Math.floor(Math.random() * (i + 1));
                    const itemAtIndex = input[randomIndex];

                    input[randomIndex] = input[i];
                    input[i] = itemAtIndex;
                }
                return input;
            },
            setSocketListeners() {
                this.socket.on('connect', () => {
                    this.debugEvents.push({name: 'connect', data: ''});
                });
                this.socket.on('play_card', card => {
                    this.debugEvents.push({name: 'play_card', data: card});
                    this.playCard(this.models[0], card);
                });
                this.socket.on('discard_card', card => {
                    console.warn("DISCARTDCARD");
                    this.debugEvents.push({name: 'discard_card', data: card});
                    this.discardCard(this.models[0], card);
                });
                this.socket.on('propose_shuriken', async () => {
                    this.debugEvents.push({name: 'propose_shuriken', data: ''});

                    let vote = (await Swal.fire({
                        title: 'The computer wants to use a Shuriken!',
                        text: "Do you agree?",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes!',
                        cancelButtonText: "No",
                    })).value;
                    this.socket.emit('shuriken_vote', vote ? 'yes' : 'no');
                    if (vote) {
                        this.activateShuriken();
                    }
                });
                this.socket.on('shuriken_vote', shurikenAgree => {
                    if (shurikenAgree) {
                        this.activateShuriken();
                    }
                    this.debugEvents.push({name: 'shuriken_vote', data: shurikenAgree});
                });
                this.socket.on('hello', world => {
                    this.debugEvents.push({name: 'hello', data: world});
                });
            }
        },
        watch: {
            debugEvents() {
                let lastValue = this.debugEvents[this.debugEvents.length - 1];
                console.log(`[${lastValue.name}]: ${lastValue.data}`);
            }
        },
        computed: {
            topCard() {
                if (this.deck.length === 0)
                    return 0;
                return this.deck[this.deck.length - 1];
            },
            dead() {
                return this.lives <= 0;
            }
        }
    }
</script>
<style scoped>
    .game {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .field {
        width: 100%;
        height: 100%;
        background-color: black;
        background-image: linear-gradient(to top, #000000 0%, #1461e5 59%, #903f0b 100%);
    }

    .playing-field {
        width: 100%;
        height: calc(100% - 140px);
        position: absolute;
        top: 0;
        left: 0;
    }

    .bottom-bar {
        width: 100%;
        height: 140px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 10px;
    }

    .bottom-bar > div {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    .cards {
        display: flex;
        position: absolute;
        overflow-x: auto;
        overflow-y: visible;
        width: 100%;
        padding: 20px;
    }

    .cards > * {
        margin-right: 10px;
        overflow: visible;
    }

    .computer {
        top: 0;
    }

    .human {
        bottom: 0;
    }

    .middle-section {
        position: absolute;
        top: 250px;
        width: 100%;
        height: calc(100% - 500px);
        display: flex;
        justify-content: space-around;
        flex-direction: row;
    }

    .deck {
        height: 300px;
        width: 200px;
        text-align: center;
        overflow-y: auto;
    }

    .deck > * {
        position: absolute;
    }

    .cards {

    }
</style>