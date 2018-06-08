const chai = require("chai"),
    expect = chai.expect;

const Card = require("../card");

describe("Card", () => {
    it("should create some cards and confirm their descriptive and short names", () => {
        let cardValue = 5;  // value of 5 is a "7"
        let suitValue = 3;  // suit of 3 should be Spade
        let testCard = new Card(cardValue, suitValue);
        expect(testCard.displayName()).to.equal("7 of Spade");
        expect(testCard.shortName()).to.equal("7S");

        cardValue = 12;
        suitValue = 0;
        testCard = new Card(cardValue, suitValue);
        expect(testCard.displayName()).to.equal("Ace of Club");
        expect(testCard.shortName()).to.equal("AC");

        cardValue = 0;
        suitValue = 2;
        testCard = new Card(cardValue, suitValue);
        expect(testCard.displayName()).to.equal("2 of Heart");
        expect(testCard.shortName()).to.equal("2H");
    });
});