"use strict";

const Card = require("./card");

class Deck {
    constructor() {
        this.cards = [];
        for (let cardValue = 0; cardValue < 13; cardValue++) {
            for (let suitValue = 0; suitValue < 4; suitValue++) {
                this.cards.push(new Card(cardValue, suitValue));
            }
        }
    }

    // Shuffle the existing cards using Fisher-Yates Modern
    shuffle() {
        // -- To shuffle an array a of n elements (indices 0..n-1):
        // for i from n−1 downto 1 do
        //     j ← random integer such that 0 ≤ j ≤ i
        //     exchange a[j] and a[i]
        for (let n = this.cards.length - 1; n > 0; --n)
        {
            //Step 2: Randomly pick a card which has not been shuffled
            let k = Math.floor(Math.random() * (n + 1));

            //Step 3: Swap the selected item with the last "unselected" card in the collection
            let temp = this.cards[n];
            this.cards[n] = this.cards[k];
            this.cards[k] = temp;
        }
    }

    deal(players, numberOfCards) {
        if (players.length * numberOfCards > this.cards.length) {
            console.error(`Not enough cards to deal ${players.length} players ${numberOfCards} cards`);
            return;
        }

        let cardsDealt = 0;
        for (let cardIndex = 0; this.cards.length > 0 && cardsDealt < numberOfCards; cardIndex++) {
            let playerIndex = cardIndex % players.length;
            let currentCard = this.cards.pop();
            players[playerIndex].deck.push(currentCard);

            // Increment # of cards dealt after dealing to last player
            if (playerIndex === players.length - 1) {
                cardsDealt++;
            }
        }
    }
}

module.exports = Deck;