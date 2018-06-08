"use strict";

const Game = require("./game");

let currentGame = new Game("Fred", "Robbie");
currentGame.Play(err => {
    if (err)
        console.error(`Game failed with error: ${err}`);
    else
        console.log("We're outta here!");
});