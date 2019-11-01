// Classes
class Card {
    constructor(suit, rank, value, faceUp = false){
        this.suit = suit;
        this.rank = rank;
        this.value = value;
        this.faceUp = faceUp;
    }
    flipCard(){
        if (this.faceUp){
            this.faceUp = false;
        } else {
            this.faceUp = true;
        }
    }
    description(){
        console.log(this.suit + ': ' + this.rank);
    }
}

// Constants
const SUITS = ['spades', 'diamonds', 'clubs', 'hearts'];
const RANKS = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven',                      'eight', 'nine', 'ten', 'jack', 'queen', 'king'];
let cards = [];

// Cached Elements

// Event Listeners

// Functions

function init(){

    // create a deck
    for (suit of SUITS)
        for (rank of RANKS)
            cards.push(new Card(suit, rank));
}

function randomCard(card){
    let random = Math.floor(Math.random() * 51);
    return cards[random];
}


