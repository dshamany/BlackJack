// Constants
const SUITS = ['spades', 'diamonds', 'clubs', 'hearts'];
const RANKS = ['A', '02', '03', '04', '05', '06', '07',                      '08', '09', '10', 'J', 'Q', 'K'];

// App State
let deck = [];
let playerTurn = true;
let dealerHand = [];
let playerHand = [];
let dealerPoints = 0;
let playerPoints = 0;

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
let dealerTable = document.querySelector('.dealer-container');
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
    dealerHand = [];
    playerHand = [];

    // Clear Board
    dealerTable.innerHTML  = '';
    playerTable.innerHTML = '';

    // Setup Table
    createCardElement(randomCard(), 'd-card', dealerTable, dealerHand);
    createCardElement(randomCard(), 'd-card', dealerTable, dealerHand);

    createCardElement(randomCard(), 'p-card', playerTable, playerHand);
    createCardElement(randomCard(), 'p-card', playerTable, playerHand);

    calculateHandTotal(dealerHand);
    calculateHandTotal(playerHand);
}

function randomCard(card){
    let random = Math.floor(Math.random() * 51);
    return deck[random];
}

function createCardElement(card, className, container, cardArr){
    cardArr.push(card);

    if (playerTurn && dealerHand.length < 2 && className === 'd-card'){
        card.isFaceUp = false;
    } else {
        card.isFaceUp = true;
    }

    let cardDiv = document.createElement('div');
    cardDiv.className = className;
    cardDiv.innerHTML = `<img src="${cardImgSrc(card)}">`;
    container.appendChild(cardDiv);

    dealerPoints = calculateHandTotal(dealerHand);
    playerPoints = calculateHandTotal(playerHand);
}

function cardImgSrc(card){
    if (card.isFaceUp)
        return `../images/${card.suit}/${card.suit}-r${card.rank}.svg`;
    return "../images/backs/blue.svg";
}

function calculateHandTotal(cardArr){
    let sum = 0;
    let aces = [];

    cardArr.forEach((card) => {
        if (card.rank === 'A') {
            aces.push(card);
        } else {
            sum += card.value();
        }
    });

    aces.forEach((card) => {
        if ((sum + 11) <= 21)
            sum += 11
        sum += card.value();
    });

    return sum;
}

function dealCard(){
    if (playerTurn){
        // Deal card to player
        createCardElement(randomCard(), 'p-card', playerTable, playerHand);

        if (playerPoints >= 21){
            hold();
        }

    } else if (dealerHand[0].isFaceUp){
        // Deal card to dealer
        createCardElement(randomCard(), 'd-card', dealerTable, dealerHand);
    } else {
        // Uncover first card before adding cards to dealer table
        let firstCard = document.querySelectorAll('.d-card')[0];
        dealerHand[0].isFaceUp = true;
        firstCard.innerHTML = `<img src="${cardImgSrc(dealerHand[0])}">`;
    }
}

function hold(){
    playerTurn = false;
    btnHold.style.disable = true;
    btnHold.style.opacity = '0.5';

    dealerPlay();
    winner();
}

function dealerPlay(){
    dealerPoints = calculateHandTotal(dealerHand);
    playerPoints = calculateHandTotal(playerHand);

    if (playerPoints > 21){
        dealCard();
        winner();
        return;
    }

    while (dealerPoints <= 15){
        dealCard();
    }

    if (!dealerHand[0].isFaceUp){
        dealCard();
    }
}

function winner(){
    if (playerPoints > 21){
        console.log('Dealer Wins!');
    } else if (dealerPoints > 21 && playerPoints <= 21){
        console.log('Player Wins!');
    } else if (playerPoints ===  21 && dealerPoints !== 21){
        console.log('Player Wins!');
    } else if (dealerPoints ===  21 && playerPoints !== 21){
        console.log('Dealer Wins!');
    } else if (dealerPoints > playerPoints){
        console.log('Dealer Wins!');
    } else if (playerPoints > dealerPoints){
        console.log('Player Wins!');
    } else if (playerPoints === dealerPoints){
        console.log('Draw!');
    }

    console.log("Dealer: ", dealerPoints);
    console.log("Player: ", playerPoints);
}

/* 
- Initilize the game by generating a card deck
- Generate a random card
- Push card to dealer table face down
- Generate a second random card
- Push the card to player table face up
- Push a third random card to the dealer table face up
- Push a fourth random card to player table face up
- Calculate dealer and player totals separately 
- If player's total value is less than 21,
  player may press 'HIT' to request another radom card
- If dealer total is less than or equal to 17, 
  dealer table automatically requests another random card
- If both dealer and player have equal cards, recalculate totals
- LOGIC:
    - if player total is under 21, check if dealer has a larger value (dealer Wins)
    - if player total is over 21 (dealer Wins)
    - if dealer exceeds 21 (Player Wins)
    - if both totals are between 17 and 20 (DRAW)

*/

// GAME
init();

