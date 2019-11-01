// Constants
const SUITS = ['spades', 'diamonds', 'clubs', 'hearts'];
const RANKS = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven',                      'eight', 'nine', 'ten', 'jack', 'queen', 'king'];
let cards = [];

// Classes
class Card {
    constructor(suit, rank, faceUp = false){
        this.suit = suit;
        this.rank = rank;
        this.faceUp = faceUp;
    }
    value(){
        switch (this.rank){
            case 'ace':
                return 1;
            case 'two':
                return 2;
            case 'three':
                return 3;
            case 'four':
                return 4;
            case 'five':
                return 5;
            case 'six':
                return 6;
            case 'seven':
                return 7;
            case 'eight':
                return 8;
            case 'nine':
                return 9;
            case 'ten':
            case 'jack':
            case 'queen':
            case 'king':
                return 10;
            default:
                return 0;
        }
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

// GAME

init();

/* 
- Initilize the game by generating a card deck
- Generate a random card
- Push card to house table face down
- Generate a second random card
- Push the card to player table face up
- Push a third random card to the house table face up
- Push a fourth random card to player table face up
- Calculate house and player totals separately 
- If player's total value is less than 21,
  player may press 'HIT' to request another radom card
- If house total is less than or equal to 17, 
  house table automatically requests another random card
- If both house and player have equal cards, recalculate totals
- LOGIC:
    - if player total is under 21, check if house has a larger value (House Wins)
    - if player total is over 21 (House Wins)
    - if house exceeds 21 (Player Wins)
    - if both totals are between 17 and 20 (DRAW)

*/

