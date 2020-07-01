<template>
  <div class="game">
    <h1>Game</h1>
    <v-sheet style="padding: 10px; margin:10px;" elevation="4">
      <h4 v-for="({name, data}, i) in debugEvents" :key="i">
        [{{name}}]: {{data}}
        <br />
      </h4>
    </v-sheet>

    <div class="jumbotron">
      <div class="container">
        <div class="row">
          <div class="col-md-3"></div>
          <div class="col-md-9">
            <v-btn @click="proposeShuriken" v-if="shurikens>0">Propose Shuriken</v-btn>
            <v-btn @click="nextRound">Next Round</v-btn>
            <v-btn @click="newGame(2)">New Game</v-btn>
          </div>
        </div>

        <div class="row">
          <div class="col-md-1"></div>
          <div class="col-md-6">
            <div class="hand" data-fan="spacing: 0.4">
              <p>Top Card: {{topCard}}</p>
              <img class="card" :src="require(`@/assets/${topCard}.svg`)" />
            </div>
            <div v-for="player in players" :key="player.name">
              <p>{{player.name}} cards:</p>
              <div
                class="hand fan active-hand"
                data-fan="flow: horizontal; spacing: 0.4; width: 60; radius: 80"
                v-for="card in player.hand"
                :key="card"
                :disabled="player.isComputer"
                @click="playCard(player, card)"
              >
                <div v-if="player.name== `model1`">
                  <img class="card" src="../assets/back_img.jpeg" />
                </div>
                <div v-else>
                  <img class="card" :src="require(`@/assets/${card}.svg`)" />
                </div>
                {{card}}
              </div>
            </div>
          </div>
          <div
            class="col-md-2 hand fan active-hand"
            data-fan="flow: horizontal; spacing: 0.4; width: 60; radius: 80"
          >
            <p>Shurikens: {{shurikens}}</p>

            <img class="card" src="../assets/shuriken.svg" />
            <img class="card" src="../assets/shuriken.svg" />
            <img class="card" src="../assets/shuriken.svg" />
          </div>
          <div
            class="col-md-2 hand fan active-hand"
            data-fan="flow: horizontal; spacing: 0.4; width: 60; radius: 80"
          >
            <p>Lives: {{lives}}</p>

            <img class="card" src="../assets/life.jpeg" />
            <img class="card" src="../assets/life.jpeg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import Player from "../js/Player";

export default {
  name: "Game",
  components: {},
  data: () => ({
    socket: null,
    debugEvents: [],
    players: [],
    models: [],
    human: null,
    deck: [],
    round: 0,
    lives: -1,
    shurikens: -1
  }),
  mounted() {
    const url = "http://localhost:5000";
    this.socket = io(url);
    console.log("Server starting:", this.socket);
    this.setSocketListeners();
    this.newGame(2);
  },
  methods: {
    newGame(players) {
      this.human = new Player("human", false);
      this.players = [];
      this.models = [];
      this.players.push(this.human);
      for (let i = 0; i < players - 1; i++) {
        let computerPlayer = new Player("model" + (i + 1), true);
        this.players.push(computerPlayer);
        this.models.push(computerPlayer);
      }
      this.lives = 3;
      this.shurikens = 3;
      this.socket.emit("new_game");
      this.newRound(2);
    },
    nextRound() {
      this.newRound(this.round + 1);
    },
    newRound(roundNumber) {
      this.round = roundNumber;
      const deckSize = 100;
      let allCards = this.shuffle(
        [...new Array(deckSize)].map((_, i) => i + 1)
      );
      for (let player of this.players) {
        player.hand = allCards.splice(0, roundNumber).sort();
      }
      this.socket.emit("new_round", this.models[0].hand);
    },
    playCard(player, ...cards) {
      for (let card of cards) {
        let index = player.hand.indexOf(card);
        console.log("removing", index, card, player.hand);
        player.hand.splice(index, 1);
      }
      if (player === this.human) this.socket.emit("cards_played", cards);
      this.deck = this.deck.concat(cards);
    },
    proposeShuriken() {
      this.socket.emit("shuriken_proposed");
    },
    activateShuriken() {
      this.shurikens--;
      console.warn("TODO");
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
      this.socket.on("connect", () => {
        this.debugEvents.push({ name: "connect", data: "" });
      });
      this.socket.on("play_card", card => {
        this.debugEvents.push({ name: "play_card", data: card });
        this.playCard(this.models[0], card);
      });
      this.socket.on("shuriken_proposed", () => {
        this.debugEvents.push({ name: "shuriken_proposed", data: "" });
      });
      this.socket.on("shuriken_vote", shurikenAgree => {
        if (shurikenAgree) {
          this.activateShuriken();
        }
        this.debugEvents.push({ name: "shuriken_vote", data: shurikenAgree });
      });
      this.socket.on("hello", world => {
        this.debugEvents.push({ name: "hello", data: world });
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
      if (this.deck.length === 0) return 0;
      return this.deck[this.deck.length - 1];
    }
  }
};
</script>
<style scoped>
.game {
  padding: 20px;
}
img.card {
  width: 70px;
  margin: 0;
  padding: 0;
  border: 0;
  vertical-align: initial;
  box-sizing: initial;
}

/*
 * A hand is a div containing cards.
 */
.hand {
  padding: 0;
  margin: 0;
}
.active-hand img.card {
  cursor: pointer;
}

/*
 * A horizontal hand, class="hand hhand".  The enitire card is visible.
 */
.hhand {
  display: inline-block;
}
.hhand img.card {
  padding-top: 10px;
}
.hhand.active-hand img.card:hover {
  padding-top: 0px;
  padding-bottom: 10px;
}

/*
 * A vertical hand, class="hand vhand".  The enitire card is visible.
 */
.vhand {
  display: block;
}
.vhand img.card {
  padding-right: 10px;
}
.vhand.active-hand img.card:hover {
  padding-right: 0px;
  padding-left: 10px;
}

/*
 * A compact horizontal hand.  Only the last card is entirely visible.
 */
.hhand-compact {
  display: inline-block;
}
.hhand-compact img.card:first-child {
  margin-left: 0px;
  padding-top: 10px;
}
.hhand-compact img.card {
  margin-left: -52px;
  padding-top: 10px;
}
.hhand-compact.active-hand img.card:hover {
  padding-top: 0px;
  padding-bottom: 10px;
}

/*
 * A compact vertical hand.  Only the last card is entirely visible.
 */
.vhand-compact {
  display: inline-block;
  vertical-align: top;
}
.vhand-compact img.card:first-child {
  display: block;
  margin-top: 0px;
  padding-right: 10px;
}
.vhand-compact img.card {
  display: block;
  margin-top: -80px;
  padding-right: 10px;
}
.vhand-compact.active-hand img.card:hover,
.active-hand .vhand-compact img.card:hover {
  display: block;
  padding-right: 0px;
  padding-left: 10px;
}

/*
 * A fanned hand.  Only the last card is entirely visible.
 */
.fan {
  display: inline-block;
  vertical-align: top;
  position: relative;
  padding-bottom: 1em;
}
.fan img.card {
  position: relative;
  width: 60px;
}
</style>