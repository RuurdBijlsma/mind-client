<template>
    <div class="tutorial">
        <h1>The Mind - Tutorial</h1>
        <section>
            <p>In The Mind the goal is to stack cards from low to high. You don't know what cards the other player has
                though! The main aim of the game is to wait just the right amount of time to play your card, in the
                hopes that the other player has already played cards that are lower than your card.</p>
            <p>There are rounds to this game, each round becoming more difficult than the last. In round 1 you each have
                one card, in round 2 you both have two cards, and so forth. The last round is round 12, if you make it
                though this round you win the game.</p>
            <p>If you play a card that is lower than the top card on the pile, you lose a life card. A life card is a a
                special card, you start the game with two life cards and one shuriken card.</p>
            <p>A shuriken card can be used to reveal the lowest card of both players. Both players have to agree to play
                a shuriken card before it can be used. At the end of some rounds you get bonus special cards, either a
                life card or a shuriken card. This will help you get through the rounds.</p>
            <p>An important aspect of The Mind is that you have to synchronize your mind with the other player in order
                to know when to play your cards, this is done by clicking and holding the hand of the model at the start
                of the round.</p>
        </section>
        <section>
            <h2>The playing field</h2>
            <img src="../assets/tutorial.png" alt="tutorial image">
            <p>The image above shows what a game can look like, below is an explanation of the different components.</p>
            <ul>
                <li><span style="color:yellow">Yellow</span>: The computer's cards, the values on these cards are not
                    visible to the player.
                </li>
                <li><span style="color:orange">Orange</span>: The discarded cards pile, when either player has to
                    discard a card, it ends up here. A card
                    has to be discarded when it's lower than the top card on the deck or when a shuriken was played.
                </li>
                <li><span style="color:lightgreen">Green</span>: The pile, this is where the cards are placed when they
                    are played. Newly played cards have to
                    be higher than the top card on this pile.
                </li>
                <li><span style="color:cyan">Cyan</span>: The special cards, the knife card(s) represent your shurikens,
                    the heart card(s) represent how many lives you have left.
                </li>
                <li><span style="color:red">Red</span>: Your cards.
                </li>
                <li><span style="color:white">White</span>: In the bottom right the round bonus is shown. In this case
                    there is a shuriken card there, which means that if you complete this round you get an extra
                    shuriken.
                </li>
            </ul>
        </section>
        <v-btn class="button" color="primary" x-large to="/play">Play Game</v-btn>
    </div>
</template>

<script>

    export default {
        name: 'Tutorial',
        data() {
            return {
                hello: 'world',
            }
        },
        components: {}
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
    .button{
        margin:20px auto;
    }
</style>
