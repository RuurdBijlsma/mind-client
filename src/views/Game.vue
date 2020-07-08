<template>
    <div class="game">
        <div class="field">
            <div class="playing-field">
                <div class="deck" ref="deck">
                    <mind-card v-for="(card, i) in deck" :value="card"
                               :style="`top: ${i*40}px; transform: translateX(${Math.round(Math.random()*20)}px)`"
                               :key="card"></mind-card>
                </div>
                <div v-if="players[1]" class="computer cards">
                    <p v-if="players[1].hand.length===0">The computer has no cards left</p>
                    <mind-card v-for="card in players[1].hand" :key="card" :value="card" :hide="true">
                    </mind-card>
                </div>
                <div v-if="players[0]" class="human cards">
                    <p v-if="players[0].hand.length===0">You have no cards left</p>
                    <mind-card v-for="card in players[0].hand" :key="card" @click="playCard(players[0], card)"
                               :value="card">
                    </mind-card>
                </div>
                <div class="star cards">
                    <mind-card :star="true" @click="proposeShuriken" outlined v-if="shurikens>0 && !nextRoundReady">
                    </mind-card>
                </div>
                <div class="life cards">
                    <mind-card :life="true">
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
                        <v-btn @click="proposeShuriken" outlined v-if="shurikens>0 && !nextRoundReady && !dead">
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
            dead: false,
            playTimeouts: [],
            nextRoundReady: false,
            //This means after completing round 2 you get 1 life
            roundBonuses: {
                2: {lives: 1},
                3: {shurikens: 1}
            }
        }),
        mounted() {
            const url = 'http://localhost:5000';
            this.socket = io(url);
            console.log('Server starting:', this.socket);
            this.setSocketListeners();
            this.newGame(2)
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
                this.dead = false;
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
                this.newRound(2);
            },
            nextRound() {
                this.newRound(this.round + 1);
            },
            newRound(roundNumber) {
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
            async playCard(player, card, noPenalty = false) {
                if (this.dead)
                    return false;
                if (!player.hand.includes(card))
                    return console.warn("Player", player, "tried to play card", card, "but it's not in their hand");
                if (card < this.topCard && !noPenalty) {
                    this.lives--;
                    this.socket.emit('life_lost', player === this.human);
                    if (this.lives === 0) {
                        for (let timeout of this.playTimeouts)
                            clearTimeout(timeout)
                        await Swal.fire({
                            title: "You died one too many times",
                            text: "You reached round " + this.round,
                            icon: "error",
                            confirmButtonText: '😢',
                        });
                        this.dead = true;
                        return;
                    }else{
                        this.playAllLowerCards();
                    }
                }

                let index = player.hand.indexOf(card);
                console.log('removing', index, card, player.hand);
                player.hand.splice(index, 1);
                if (this.human.hand.length === 0) {
                    let i = 0;
                    for (let card of this.models[0].hand) {
                        this.playTimeouts.push(setTimeout(async () => {
                            await this.playCard(this.models[0], card);
                        }, ++i * 300));
                    }
                    this.playTimeouts.push(setTimeout(async () => {
                        this.socket.emit('update_model_hand', this.models[0].hand);
                    }, i * 300));
                }

                if (player === this.human) {
                    this.socket.emit('card_played', card);
                }
                this.deck.push(card);
                setTimeout(() => {
                    if (this.$refs.deck)
                        this.$refs.deck.scroll(0, this.$refs.deck.scrollHeight);
                }, 50);

                if (this.players.every(player => player.hand.length === 0)) {
                    if (this.round === 12) {
                        await Swal.fire({
                            title: "You win!",
                            icon: "success",
                            confirmButtonText: '😃',
                        });
                    } else {
                        let bonuses = this.roundBonuses[this.round];
                        if(bonuses){
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
                let i = 0;
                for (let player of this.players) {
                    let lowestCard = player.hand[0];
                    this.playTimeouts.push(setTimeout(async () => {
                        await this.playCard(player, lowestCard, true);

                        if (player === this.human) {
                            this.socket.emit('update_player_hand_size', this.human.hand.length);
                        } else {
                            this.socket.emit('update_model_hand', this.models[0].hand);
                        }
                    }, ++i * 300));
                }
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
                this.socket.on('shuriken_proposed', () => {
                    this.debugEvents.push({name: 'shuriken_proposed', data: ''});
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

    .star {
        top:38%;
    }

    .life{
        left: 90%;
        top: 38%;
    }
    
    .deck {
        position: absolute;
        top: calc(50% - 150px - -20px);
        left: calc(50% - 100px);
        height: 300px;
        width: 200px;
        text-align: center;
        overflow-y: auto;
    }

    .deck > * {
        position: absolute;
    }

</style>