// JavaScript Document

var hangman = {
	guesses: 10,
	answer: "",
	guessedWord: [],
	guessedWordStr: function() {
		return hangman.guessedWord.toString().replace(/,/g, '');
	},
	chooseWord: function() {
		hangman.answer = Word_List.getRandomWord();
		for( var x = 0; x < hangman.answer.length; x++ ) {
			hangman.guessedWord[x] = " ";
		}
	},
	placeGuessesRemaining: function() {
		document.getElementById("guesses").innerHTML = hangman.guesses;
	},
	placeBlanks: function() {
		document.getElementById("word").innerHTML = "";
		for( var i = 0; i < hangman.answer.length; i++ ) {
			var node = document.createElement("SPAN");
			node.setAttribute("id", "answer-" + i);
			var textNode = document.createTextNode("_ ");
			node.appendChild(textNode);
			if(hangman.answer[i] == " ") {
				var b = document.createElement("BR");
				document.getElementById("word").appendChild(b);
			} else {
				document.getElementById("word").appendChild(node);
			}
		}
	},
	guess: function(ltr) {				
		var wrongGuess = 0;
		
		for(var t = 0; t < hangman.answer.length; t++ ) {
			if( ltr === hangman.answer[t] ) {
				document.getElementById("answer-" + t).innerHTML = ltr + " ";
				hangman.guessedWord[t] = ltr;
			} else {
				wrongGuess++;
			}
			document.getElementById("guess-" + ltr).style.display = "inline";
		}
		if( wrongGuess == hangman.answer.length ) {
			hangman.guesses--;
			hangman.placeGuessesRemaining();
		}
		if( hangman.answer == hangman.guessedWordStr() && hangman.guesses > 0) {
			hangman.win();
		} else if(hangman.guesses == 0) {
			hangman.lose();
		}
	},
	win: function() {
		alert("You win!");
		document.getElementById("guess-input").children[0].disabled = true;
		document.getElementById("new-game").children[0].style.visibility = "visible";
	},
	lose: function() {
		alert("You lose!");
		document.getElementById("guess-input").children[0].disabled = true;
		document.getElementById("new-game").children[0].style.visibility = "visible";
		for(var t = 0; t < hangman.answer.length; t++ ) {
			document.getElementById("answer-" + t).innerHTML = hangman.answer[t] + " ";
		}
	},
	hideGuessedLetters: function() {
		var guessedLetterChildren = document.getElementById("guessed-letters").children;
		for( var i = 0; i < guessedLetterChildren.length; i++ ) {
			guessedLetterChildren[i].style.display = "none";
		}
	},
	init: function() {
		hangman.chooseWord();
		hangman.guesses = 10;
		hangman.placeGuessesRemaining();
		hangman.placeBlanks();
		hangman.hideGuessedLetters();
		document.getElementById("new-game").children[0].style.visibility = "hidden";
		document.getElementById("guess-input").children[0].disabled = false;
		selectStyle("day");
	}
};

function isLetter(str) {
	return str.length === 1 && str.match(/[a-z]/i);
}

function processInput(ltr) {
	var l = ltr[0]; // in case of fast typing, grab only first char
	var abc = ["a", "b", "c", "d", "e", "f",
		  "g", "h", "i", "j", "k", "l",
		  "m", "n", "o", "p", "q", "r",
		  "s", "t", "u", "v", "w", "x",
		  "y", "z", ];
	if(l != undefined) { // fast typing results in undefined
		if( isLetter(l) ) {
			l = l.toLowerCase(); // convert to lower case letter
			hangman.guess(l);
		}
	}
	document.getElementById("guess-input").children[0].value = "";
}

function selectStyle(s) {
	document.getElementById("day-night-stylesheet").setAttribute("href", "assets/css/" + s + ".css");
}

window.onload = hangman.init;