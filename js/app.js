/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const deck = document.querySelector('.deck');
const cards = Array.from(document.querySelectorAll('.card'));
const compare = [];
let clickActive = true;

const flipAnim = 'jello';
const matchAnim = 'rubberBand';
const noMatchAnim = 'shake';

let moves = 0;
const movesHolder = document.querySelector('.moves');
const starsHolder = document.querySelector('.stars').querySelectorAll('.fa');

const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', initGame);

let gameTime = 0;
let gameTimer;
const timer = document.querySelector('.timer');

initGame();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function initGame() {
	moves = 0;
	movesHolder.innerText = 0;

	starsHolder.forEach(function(element){
		element.classList.replace('fa-star-o', 'fa-star');
	});

	resetCompare();

	shuffle(cards);

	// remove all cards
	while (deck.firstChild) {
		deck.removeChild(deck.firstChild);
	}

	// replace cards
	for (let i = 0; i < cards.length; i++) {
		cards[i].addEventListener('click', cardClicked);
		cards[i].className = 'card animated';
		deck.appendChild(cards[i]);
	}

	clearInterval(gameTimer);
	gameTimer = null;
	gameTime = 0;
	timer.innerText = 0;
}

function removeCardClasses(...classes) {
	compare.forEach(function(card) {
		card.classList.remove(...classes);
	});
}

function addCardClasses(...classes) {
	compare.forEach(function(card) {
		card.classList.add(...classes);
	});
}

function cardClicked() {
	if (!clickActive) { return; }
	if (!gameTimer) {
		console.log('timer started');
		gameTimer = setInterval(updateTimer, 1000);
	}

	compare.push(this);

	this.removeEventListener('click', cardClicked);
	addCardClasses('open', 'show', flipAnim);

	if (compare.length === 2) {
		compareCards();
	}
}

function compareCards() {
	clickActive = false;

	const card1 = compare[0].querySelector('.fa').className;
	const card2 = compare[1].querySelector('.fa').className;

	card1 === card2 ? matchCards() : hideCards();

	incrementMoves();
}

function matchCards() {
	addCardClasses('match', matchAnim);
	removeCardClasses('open', 'show', flipAnim);

	resetCompare();
}

function hideCards() {
	addCardClasses(noMatchAnim);

	setTimeout(function() {
		removeCardClasses('open', 'show', flipAnim, noMatchAnim);
		compare.forEach(function(card){
			card.addEventListener('click', cardClicked);
		});

		resetCompare();
	}, 1550);
}

function resetCompare() {
	compare.length = 0;
	clickActive = true;
}

function incrementMoves() {
	moves++;
	movesHolder.innerText = moves;

	adjustStars();
}

function adjustStars() {
	if (moves == 10) {
		starsHolder[2].classList.replace('fa-star', 'fa-star-o');
	} else if (moves == 17) {
		starsHolder[1].classList.replace('fa-star', 'fa-star-o');
	} else if (moves == 23) {
		starsHolder[0].classList.replace('fa-star', 'fa-star-o');
	}
}

function updateTimer() {
	gameTime++;

	const date = new Date(gameTime * 1000);
	const formatedTime = date.getUTCMinutes() + ':' + date.getSeconds();

	timer.innerText = formatedTime; // use moment.js later
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
