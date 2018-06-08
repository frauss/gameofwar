const chai = require("chai"),
    expect = chai.expect;

const Card = require("../card");
const Deck = require("../deck");
const Player = require("../player");

describe("Deck", () => {
    it("should create a new deck with first card being 2 of Clubs and last being Ace of Spades", () => {
        let testDeck = new Deck();

        let testCard = testDeck.cards[0];
        expect(testCard.displayName()).to.equal("2 of Club");
        expect(testCard.shortName()).to.equal("2C");

        testCard = testDeck.cards[testDeck.cards.length - 1];
        expect(testCard.displayName()).to.equal("Ace of Spade");
        expect(testCard.shortName()).to.equal("AS");
    });

    it("should create a new deck, shuffle it and confirm that cards are shuffled and complete", () => {
        let testDeck = new Deck();
        testDeck.shuffle();

        let testCard = testDeck.cards[0];
        expect(testCard.displayName()).to.not.equal("2 of Club");
        expect(testCard.shortName()).to.not.equal("2C");

        testCard = testDeck.cards[testDeck.cards.length - 1];
        expect(testCard.displayName()).to.not.equal("Ace of Spade");
        expect(testCard.shortName()).to.not.equal("AS");

        // Confirm all cards are in the deck
        let cardCounts = Array.apply(null, new Array(52)).map(Number.prototype.valueOf, 0);
        for (let cardValue = 0; cardValue < 13; cardValue++) {
            for (let suitValue = 0; suitValue < 4; suitValue++) {

                let foundCard = false;
                for (let cardIndex = 0; cardIndex < 52; cardIndex++) {
                    if (testDeck.cards[cardIndex].suit === suitValue &&
                    testDeck.cards[cardIndex].value === cardValue) {
                        if (cardCounts[cardIndex] === 0) {
                            cardCounts[cardIndex] = 1;
                        }
                        else if (cardCounts[cardIndex] > 0) {
                            console.error(`Card ${testDeck.cards[cardIndex].displayName()} is in the desk more than once`);
                            cardCounts[cardIndex] += 1;
                        }
                        foundCard = true;
                    }
                }
                if (!foundCard) {
                    let missingCard = new Card(cardValue, suitValue);
                    console.error(`Card ${missingCard.displayName()}`);
                }
            }
        }
        for (let cardIndex = 0; cardIndex < 52; cardIndex++) {
            if (cardCounts[cardIndex] === 0) {
                console.error(`Card ${testDeck.cards[cardIndex].displayName()} is missing from the deck`);
            }
        }
    });

    it("should create a new deck, shuffle it deal all of it to 2 players", () => {
        let testDeck = new Deck();
        testDeck.shuffle();

        let numPlayers = 2;
        let playerArray = [];
        for (let playerIndex = 0; playerIndex < numPlayers; playerIndex++) {
            let playerName = `Player${playerIndex + 1}`;
            playerArray.push(new Player(playerName));
        }

        let numCards = 26;
        testDeck.deal(playerArray, numCards);
        expect(testDeck.cards.length).to.equal(0);
        expect(playerArray[0].deck.length).to.equal(numCards);
        expect(playerArray[1].deck.length).to.equal(numCards);
    });

    it("should create a new deck, shuffle it deal 5 cards to 5 players", () => {
        let testDeck = new Deck();
        testDeck.shuffle();

        let numPlayers = 5;
        let playerArray = [];
        for (let playerIndex = 0; playerIndex < numPlayers; playerIndex++) {
            let playerName = `Player${playerIndex + 1}`;
            playerArray.push(new Player(playerName));
        }

        let numCards = 5;
        testDeck.deal(playerArray, numCards);
        for (let playerIndex = 0; playerIndex < numPlayers; playerIndex++) {
            expect(playerArray[playerIndex].deck.length).to.equal(numCards);
        }
        expect(testDeck.cards.length).to.equal(52 - (numPlayers * numCards));
    });
});