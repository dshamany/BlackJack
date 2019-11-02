// Constants
const SUITS = ['spades', 'diamonds', 'clubs', 'hearts'];
const RANKS = ['A', '02', '03', '04', '05', '06', '07',                      '08', '09', '10', 'J', 'Q', 'K'];

// App State
let deck = [];
let playerTurn = true;
let houseHand = [];
let playerHand = [];

// Classes
class Card {
    constructor(suit, rank, isFaceUp = true){
        this.suit = suit;
        this.rank = rank;
        this.isFaceUp = isFaceUp;
    }
    value(){
        switch (this.rank){
            case 'A':
                return 1;
            case 'J':
            case 'Q':
            case 'K':
                return 10;
            default:
                return Number(this.rank);
        }
    }
    flipCard(){
        if (this.isFaceUp){
            this.isFaceUp = false;
        } else {
            this.isFaceUp = true;
        }
    }
    description(){
        console.log(this.suit + ': ' + this.rank);
    }
}

// Cached Elements
let houseTable = document.querySelector('.house-container');
let playerTable = document.querySelector('.player-container');
let btnHit = document.querySelector('#btnHit');
let btnHold = document.querySelector('#btnHold');

// Event Listeners
btnHit.addEventListener('click', dealCard);
btnHold.addEventListener('click', hold);

// Functions
function init(){

    // create a deck
    for (suit of SUITS)
        for (rank of RANKS)
            deck.push(new Card(suit, rank));
    

    // Reset Turn
    playerTurn = true;

    // Reset Arrays
    houseHand = [];
    playerHand = [];

    // Clear Board
    houseTable.innerHTML  = '';
    playerTable.innerHTML = '';

    // Setup Table
    let firstCard = randomCard();
    firstCard.isFaceUp = false;
    createCardElement(firstCard, 'h-card', houseTable, houseHand);
    createCardElement(randomCard(), 'h-card', houseTable, houseHand);

    createCardElement(randomCard(), 'p-card', playerTable, playerHand);
    createCardElement(randomCard(), 'p-card', playerTable, playerHand);

    calculateHandTotal(houseHand);
    calculateHandTotal(playerHand);
}

function randomCard(card){
    let random = Math.floor(Math.random() * 51);
    return deck[random];
}

function createCardElement(card, className, container, cardArr){
    cardArr.push(card);
    let cardDiv = document.createElement('div');
    cardDiv.className = className;
    cardDiv.innerHTML = `<img src="${cardImgSrc(card)}">`;
    container.appendChild(cardDiv);
}

function cardImgSrc(card){
    if (card.isFaceUp)
        return `../images/${card.suit}/${card.suit}-r${card.rank}.svg`;
    return "../images/backs/blue.svg";
}

function calculateHandTotal(cardArr){
    let sum = 0;
    cardArr.forEach((card) => {
        if (card.rank === 'A' && (sum + 11) < 21){
            sum += 11;
        } else {
            sum += card.value();
        }
    });
    return sum;
}

function dealCard(){
    if (playerTurn){
        createCardElement(randomCard(), 'p-card', playerTable, playerHand);
    } else if (houseHand[0].isFaceUp){
        createCardElement(randomCard(), 'h-card', houseTable, houseHand);
    } else {
        // Uncover first card before adding cards to house table
        let firstCard = document.querySelectorAll('.h-card')[0];
        houseHand[0].isFaceUp = true;
        firstCard.innerHTML = `<img src="${cardImgSrc(houseHand[0])}">`;
    }
}

function hold(){
    playerTurn = false;
    btnHold.style.disable = true;
    btnHold.style.opacity = '0.5';
}

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

// GAME
init();

console.log(calculateHandTotal(houseHand));
console.log(calculateHandTotal(playerHand));