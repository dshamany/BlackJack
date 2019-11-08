
// Constants
const SUITS         = ['spades', 'diamonds', 'clubs', 'hearts'];
const RANKS         = ['A', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K'];

// App State
let deck            = [];
let playerTurn      = false;
let dealerHand      = [];
let playerHand      = [];
let dealerPoints    = 0;
let playerPoints    = 0;
let gameOver        = false;
let dealCardAudio   = new Audio("../audio/deal-card.wav");
let flipCardAudio   = new Audio("../audio/flip-card.wav");


// Classes
class Card {
    constructor(suit, rank, isFaceUp = true) {
        this.suit = suit;
        this.rank = rank;
        this.isFaceUp = isFaceUp;
    }
    value() {
        switch (this.rank) {
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
}

// Cached Elements
let dealerTable     = document.querySelector('.dealer-container');
let playerTable     = document.querySelector('.player-container');
let btnHit          = document.querySelector('#btnHit');
let btnHold         = document.querySelector('#btnHold');
let mainDisplay     = document.querySelector("#message-container");
let startGame       = document.querySelector("#start-game");

// Event Listeners
btnHit.addEventListener('click', dealCard);
btnHold.addEventListener('click', hold);


// Functions
function init() {
    // create a deck
    for (suit of SUITS)
        for (rank of RANKS)
            deck.push(new Card(suit, rank));


    // Reset Game State
    playerTurn = true;
    btnHold.style.disable = false;
    btnHold.style.opacity = '1';
    gameOver = false;

    mainDisplay.innerHTML = '';

    // Reset Arrays
    dealerHand = [];
    playerHand = [];

    // Clear Board
    dealerTable.innerHTML = '';
    playerTable.innerHTML = '';

    // Setup Table
    createCardElement(randomCard(), 'd-card', dealerTable, dealerHand);
    createCardElement(randomCard(), 'p-card', playerTable, playerHand);
    createCardElement(randomCard(), 'd-card', dealerTable, dealerHand);
    createCardElement(randomCard(), 'p-card', playerTable, playerHand);

    calculateHandTotal(dealerHand);
    calculateHandTotal(playerHand);

    displayPoints();
}

function randomCard(card) {
    let random = Math.floor(Math.random() * 51);
    return deck[random];
}

function cardImgSrc(card) {
    if (card.isFaceUp)
        return `images/${card.suit}/${card.suit}-r${card.rank}.svg`;
    return "images/backs/blue.svg";
}

function createCardElement(card, className, container, cardArr) {
    cardArr.push(card);

    dealCardAudio.playbackRate = 2.5;
    dealCardAudio.play();

    if (dealerHand.length < 2 && className === 'd-card') {
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

function calculateHandTotal(cardArr) {
    let sum = 0;
    let aces = [];

    cardArr.forEach((card) => {
        if (card.isFaceUp) {
            if (card.rank === 'A') {
                aces.push(card);
            } else {
                sum += card.value();
            }
        }
    });

    aces.forEach((card) => {
        if ((sum + 11) <= 21) {
            sum += 11;
        } else {
            sum++;
        }
    });

    return sum;
}

function dealCard() {
    if (gameOver) {
        init();
        return;
    }

    if (playerTurn) {
        // Deal card to player
        createCardElement(randomCard(), 'p-card', playerTable, playerHand);

        if (playerPoints >= 21) {
            hold();
        }

    } else if (dealerHand[0].isFaceUp) {
        // Deal card to dealer
        createCardElement(randomCard(), 'd-card', dealerTable, dealerHand);
    } else {
        // Play Audio
        flipCardAudio.playbackRate = 2;
        flipCardAudio.play();

        // Uncover first card before adding cards to dealer table
        let firstCard = document.querySelectorAll('.d-card')[0];
        dealerHand[0].isFaceUp = true;
        firstCard.innerHTML = `<img src="${cardImgSrc(dealerHand[0])}">`;
    }

    playerPoints = calculateHandTotal(playerHand);
    dealerPoints = calculateHandTotal(dealerHand);

    displayPoints();
}

function hold() {
    // Change Hold Button Style
    playerTurn = false;
    btnHold.style.disable = true;
    btnHold.style.opacity = '0.3';

    dealerPlay();
}

function dealerPlay() {
    dealCard(); // To uncover first card
    if (dealerPoints >= 14){
        winner();
        return;
    } else {
        while (dealerPoints < 14) {
            dealCard();
        }
    
        winner();
    }
}

function setAlert(msg) {
    gameOver = true;
    document.querySelector("#message-container").innerHTML = msg;
}

function winner() {
    let msg = '';

    if (playerPoints > 21) {
        msg = 'Dealer Wins!'
    } else if (dealerPoints > 21 && playerPoints <= 21) {
        msg = 'Player Wins!';
    } else if (playerPoints === 21 && dealerPoints !== 21) {
        msg = 'Player Wins!';
    } else if (dealerPoints === 21 && playerPoints !== 21) {
        msg = 'Dealer Wins!';
    } else if (dealerPoints > playerPoints) {
        msg = 'Dealer Wins!'
    } else if (playerPoints > dealerPoints) {
        msg = 'Player Wins!';
    } else if (playerPoints === dealerPoints) {
        msg = 'Draw!';
    }

    if (msg != '') {
        setAlert(msg);
    }
}

function createPointContainer(table, hand, id){
    let pts = document.createElement('div');
    pts.className = 'display-pts';
    pts.id = id;
    pts.textContent = calculateHandTotal(hand);
    table.appendChild(pts);
}

function displayPoints(){
    createPointContainer(playerTable, playerHand, 'player-points');
    createPointContainer(dealerTable, dealerHand, 'dealer-points');
}

/* 
- Initilize the game by generating a card deck
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

