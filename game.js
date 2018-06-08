"use strict";

const async = require("async");
const readline = require("readline");

const Deck = require("./deck");
const Player = require("./player");

const turnLimit = 1000;

const consoleInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Game {

    constructor(playerName1, playerName2, shuffleDeck = true, cardsToDeal = 26) {
        this.players = [
            new Player(playerName1),
            new Player(playerName2)
        ];
        this.deck = new Deck();
        if (shuffleDeck)
            this.deck.shuffle();
        this.deck.deal(this.players, cardsToDeal);
        this.numTurns = 0;
        this.turnCards = [
            [],
            []
        ];
    }

    GameComplete() {
        if (this.players[0].deck.length === 0) {
            return 1;
        }
        else if (this.players[1].deck.length === 0) {
            return 2;
        }
        else if (this.numTurns > 1000) {
            return 3;
        }
        else {
            return 0;
        }
    }

    MoveCardsToLoser(losingPlayer) {
        let cardsToMove = this.turnCards[0].length;
        for (let cardIndex = 0; cardIndex < cardsToMove; cardIndex++)
            this.players[losingPlayer - 1].deck.push(this.turnCards[0].shift());
        cardsToMove = this.turnCards[1].length;
        for (let cardIndex = 0; cardIndex < cardsToMove; cardIndex++)
            this.players[losingPlayer - 1].deck.push(this.turnCards[1].shift());
    }

    Play(gameOverCallback) {
        const self = this;
        this.numTurns = 0;
        let winningPlayer = this.GameComplete();
        async.whilst(() => {
            return winningPlayer === 0;
        },
        callback => {
            this.PlayTurn((err, turnWinner) => {
                console.log(`Player ${turnWinner} wins turn.`);
                console.log(`Player 1 has ${this.players[0].deck.length} cards, Player 2 has ${this.players[1].deck.length} cards`);
                consoleInterface.question("Hit <enter> to continue", () => {
                    winningPlayer = self.GameComplete();
                    callback(err, winningPlayer);
                });
            });
        },
        (err, winningPlayer) => {
            if (winningPlayer === 3) {
                console.log(`Game over turn limit of ${turnLimit} exceeded`);
            }
            else {
                console.log(`Player ${winningPlayer} wins!`);
            }
            consoleInterface.question("Hit <enter> to end the game", () => {
                gameOverCallback(err, winningPlayer, self.numTurns);
            });
        });
    }

    DealCard(playerNumber) {

        // Make sure there's a card left in player 1's deck
        if (this.players[playerNumber - 1].deck.length > 0) {
            let dealtCard = this.players[playerNumber - 1].deck.shift();
            this.turnCards[playerNumber - 1].push(dealtCard);
            console.log(`Dealt Player ${playerNumber} ${dealtCard.shortName()}`);
            return dealtCard;
        }

        // Otherwise opposite player wins
        else {
            console.log(`Player ${playerNumber} has no cards left`);
            return null;
        }
    }

    PlayTurn(turnOverCallback) {

        // Deal a card from each player. If the player has no cards left in their
        // deck at this point they lose the turn
        let player1Card = this.DealCard(1);
        if (!player1Card) {
            this.MoveCardsToLoser(1);
            async.setImmediate(() => {
                turnOverCallback(null, 1);
            });
        }

        let player2Card = this.DealCard(2);
        if (!player2Card) {
            this.MoveCardsToLoser(2);
            async.setImmediate(() => {
                turnOverCallback(null, 2);
            });
        }

        console.log(`Player 1 ${player1Card.shortName()} vs. Player 2 ${player2Card.shortName()}`);
        if (player1Card.value === player2Card.value) {

            // Try to move 3 cards from each players deck to turn deck
            // If a player runs out of cards they lose the war
            let playerDeckRanOut = 0;
            for (let cardIndex = 0; cardIndex < 3; cardIndex++) {
                player1Card = this.DealCard(1);
                if (!player1Card) {
                    this.MoveCardsToLoser(1);
                    playerDeckRanOut = 2;
                    break;
                }
                player2Card = this.DealCard(2);
                if (!player2Card) {
                    this.MoveCardsToLoser(2);
                    playerDeckRanOut = 1;
                    break;
                }
            }

            // Play another turn
            if (!playerDeckRanOut)
                this.PlayTurn(turnOverCallback);
            else {
                async.setImmediate(() => {
                    turnOverCallback(null, playerDeckRanOut);
                });
            }
        }

        // Player 1 wins add cards to Player 2's deck
        else if (player1Card.value > player2Card.value) {
            this.MoveCardsToLoser(2);
            async.setImmediate(() => {
                turnOverCallback(null, 1);
            });
        }

        // Player 2 wins add cards to Player 1's deck
        else {
            this.MoveCardsToLoser(1);
            async.setImmediate(() => {
                turnOverCallback(null, 2);
            });
        }
    }
}

module.exports = Game;