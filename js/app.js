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
let matches = 0;
let clickActive = true;

const flipAnim = 'jello';
const matchAnim = 'rubberBand';
const noMatchAnim = 'shake';

let moves = 0;
const movesHolder = document.querySelector('.moves');
const starsHolder = document.querySelector('.stars').querySelectorAll('.fa');
let stars = 3;
const restartButton = document.querySelector('.restart');

let gameTime = 0;
let gameTimer;
const timer = document.querySelector('.timer');

const winModal = document.querySelector('.winModal');
const replayButton = document.querySelector('.replay');

initGame();
restartButton.addEventListener('click', initGame);
replayButton.addEventListener('click', initGame);


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
	// reset matches
	matches = 0;

	// reset the moves and stars
	moves = 0;
	movesHolder.innerText = 0;

	stars = 3;
	starsHolder.forEach(function(element){
		element.classList.replace('fa-star-o', 'fa-star');
	});

	// reset the timer
	clearInterval(gameTimer);
	gameTimer = null;
	gameTime = 0;
	timer.innerText = 0;

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

	winModal.classList.add('hidden');
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

	checkCompleted();
}

function matchCards() {
	matches++;

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
	if (moves == 20) {
		stars--;
		starsHolder[2].classList.replace('fa-star', 'fa-star-o');
	} else if (moves == 30) {
		stars--;
		starsHolder[1].classList.replace('fa-star', 'fa-star-o');
	} else if (moves == 40) {
		stars--;
		starsHolder[0].classList.replace('fa-star', 'fa-star-o');
	}
}

function updateTimer() {
	gameTime++;

	const date = new Date(gameTime * 1000);
	const formatedTime = date.getUTCMinutes() + ':' + date.getSeconds();

	timer.innerText = formatedTime;
}

function checkCompleted() {
	if (matches === (cards.length /2)) {
		clearInterval(gameTimer);

		const winTime = winModal.querySelector('.win-time');
		const winStars = winModal.querySelector('.win-stars');

		winTime.innerText = timer.innerText;
		winStars.innerText = stars;

		setTimeout(function(){
			winModal.classList.remove('hidden');
		}, 1200);
	}
}