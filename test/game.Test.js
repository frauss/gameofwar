const chai = require("chai"),
    expect = chai.expect;

const Game = require("../game");

describe("Game", () => {
    it("should create a new game with each player having 10 cards but Player 1's cards being lower in value than Player 2", done => {
        let currentGame = new Game("TestPlayer1", "TestPlayer1", false, 4);
        currentGame.Play((err, winningPlayer, numTurns) => {
            expect(winningPlayer).to.equal(2);
            expect(numTurns).to.equal(4);
            done();
        });
    });
});