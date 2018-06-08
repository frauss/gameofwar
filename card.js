"use strict";

const Suits = [
    "Club",
    "Diamond",
    "Heart",
    "Spade"
];

const Values = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "Jack",
    "Queen",
    "King",
    "Ace"
];

class Card {

    constructor(value, suit) {
        this.value = value;
        this.suit = suit;
    }

    displayName() {
        return `${Values[this.value]} of ${Suits[this.suit]}`;
    }

    shortName() {
        let returnName;
        if (this.value >= 0 && this.value <= 8) {
            let adjustedValue = this.value + 2;
            returnName = adjustedValue.toString();
        }
        else if (this.value === 9) {
            returnName = "J";
        }
        else if (this.value === 10) {
            returnName = "Q";
        }
        else if (this.value === 11) {
            returnName = "K";
        }
        else if (this.value === 12) {
            returnName = "A";
        }
        return returnName + Suits[this.suit].substr(0, 1);
    }
}

module.exports = Card;