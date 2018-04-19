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

let moves = 0;
const movesHolder = document.querySelector('.moves');
const starsHolder = document.querySelector('.stars').querySelectorAll('.fa');

const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', initGame);

let gameTime = 0;

initGame();

function initGame() {
	resetGame();
	shuffle(cards);

	// remove all cards
	while (deck.firstChild) {
		deck.removeChild(deck.firstChild);
	}

	// replace cards
	for (let i = 0; i < cards.length; i++) {
		cards[i].addEventListener('click', cardClicked);
		cards[i].classList.remove('open', 'show', 'match', 'flip', 'ruberBand');
		deck.appendChild(cards[i]);
	}

	// setInterval(updateTimer, 1000);
}

function resetGame() {
	moves = 0;
	movesHolder.innerText = 0;

	starsHolder.forEach(function(element){
		element.classList.replace('fa-star-o', 'fa-star');
	});

	resetCompare();
}

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

function resetDeck() {

}

function cardClicked() {
	if (!clickActive) { return; }

	// remove the clicked event listener, re-adds later if not a match
	this.removeEventListener('click', cardClicked);

	this.classList.add('open', 'show', 'pulse');

	const card = this.querySelector('.fa');
	const cardName = card.className;

	compare.push(this);

	if (compare.length === 2) {
		clickActive = false;
		compareCards();
	}
}

function compareCards() {
	const card1 = compare[0].querySelector('.fa').className;
	const card2 = compare[1].querySelector('.fa').className;

	if (card1 == card2) {
		matchCards();
	} else {
		compare[0].classList.add('shake');
		compare[1].classList.add('shake');
		setTimeout(hideCards, 1750);
	}

	incrementMoves();
}

function matchCards() {
	removeOpenShow();

	compare[0].classList.add('match', 'rubberBand');
	compare[1].classList.add('match', 'rubberBand');

	resetCompare();
}

function hideCards() {
	removeOpenShow();

	compare[0].addEventListener('click', cardClicked);
	compare[1].addEventListener('click', cardClicked);

	resetCompare();
}

function removeOpenShow() {
	compare[0].classList.remove('open', 'show', 'pulse');
	compare[1].classList.remove('open', 'show', 'pulse');

	clickActive = true;
}

function resetCompare() {
	compare.length = 0;
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

	document.querySelector('.timer').innerText = formatedTime; // use moment.js later
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
