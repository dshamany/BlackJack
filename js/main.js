// Constants
const SUITS = ['spades', 'diamonds', 'clubs', 'hearts'];
const RANKS = ['A', '02', '03', '04', '05', '06', '07',                      '08', '09', '10', 'J', 'Q', 'K'];

// App State
let cards = [];
let playerTurn = true;
let houseCards = [];
let playerCards = [];

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
let houseContainer = document.querySelector('.house-container');
let playerContainer = document.querySelector('.player-container');
// Event Listeners
document.querySelector('#btnHit').addEventListener('click', displayCards);

// Functions
function init(){

    // create a deck
    for (suit of SUITS)
        for (rank of RANKS)
            cards.push(new Card(suit, rank));
    
    playerCards = [];
    houseCards = [];
}

function randomCard(card){
    let random = Math.floor(Math.random() * 51);
    return cards[random];
}

function serveCard(){
    let card = randomCard();

    // Determine where to push the card
    if (playerTurn && calculateHandTotal(playerCards) < 21){
        playerCards.push(card);
    } else if (!playerTurn && calculateHandTotal(houseCards) <= 17){
        if (houseCards.length === 0){
            card.isFaceUp = false;
            houseCards.push(card);
        } else if (houseCards.length === 1 || 
            houseCards[0].isFaceUp){
            card.isFaceUp = true;
            houseCards.push(card);
        } else if (houseCards.length === 2){
            houseCards[0].isFaceUp = true;
        }
    }
    return card;
}

function createCardElement(card, className, container, cardArr){
    let cardDiv = document.createElement('div');
    cardDiv.className = className;
    cardDiv.innerHTML = `<img src="${cardImgSrc(card)}">`;
    container.appendChild(cardDiv);
    console.log(calculateHandTotal(cardArr));
}

function displayCards(){
    serveCard();
    playerContainer.innerHTML = '';
    playerCards.forEach((card) => {
        createCardElement(card, 'p-card', playerContainer, playerCards);
    });
    houseContainer.innerHTML = '';
    houseCards.forEach((card) => {
       createCardElement(card, 'h-card', houseContainer, houseCards);
    });
    console.log(calculateHandTotal(houseCards));

    playerTurn = switchTurn();
}

function cardImgSrc(card){
    if (card.isFaceUp)
        return `../images/${card.suit}/${card.suit}-r${card.rank}.svg`;
    return "../images/backs/blue.svg";
}

function calculateHandTotal(cardArr){
    let sum = 0;
    cardArr.forEach((card) => {
        if (card.rank === 'A' && sum < 21)
            sum += 11;
        else {
            sum += card.value();
        }
    });
    return sum;
}

function switchTurn(){
    return playerTurn ? false : true;
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