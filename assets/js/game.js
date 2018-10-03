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
		// reset the selected element
		document.getElementById("select-letter").value="";
		
		// delete the previously guessed <select> letter
		selectList.deleteGuessedLetter(ltr);
		
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
			alert("You win!");
		} else if(hangman.guesses == 0) {
			hangman.lose();
		}
	},
	lose: function() {
		alert("You lose!");
		document.getElementById("select-letter").disabled = true;
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
		document.getElementById("select-letter").disabled = false;
		selectList.init();
		selectStyle("day");
	}
};

var selectList = {
	letters: ["a", "b", "c", "d", "e", "f",
		  "g", "h", "i", "j", "k", "l",
		  "m", "n", "o", "p", "q", "r",
		  "s", "t", "u", "v", "w", "x",
		  "y", "z", ],
	getIndex: function(ltr) {
		for( var z = 0; z < 26; z++ ) {
			if(ltr == selectList.letters[z] ) {
				return z;
			}
		}
	},
	init: function() {
		document.getElementById("select-letter").innerHTML = "";

		selectList.letters = ["a", "b", "c", "d", "e", "f",
		  "g", "h", "i", "j", "k", "l",
		  "m", "n", "o", "p", "q", "r",
		  "s", "t", "u", "v", "w", "x",
		  "y", "z", ];
		selectList.selectArray = [];
		
		var sNode = document.createElement("OPTION");
		sNode.setAttribute("value", "");
		var sNodeTextNode = document.createTextNode("Select One");
		sNode.appendChild(sNodeTextNode);
		selectList.selectArray.push(sNode);
		
		for( var a = 0; a < 26; a++ ) {
			var currentChar = selectList.letters[a];
			var ltrNode = document.createElement("OPTION");
			ltrNode.setAttribute("value", currentChar);
			var ltrNodeTextNode = document.createTextNode(currentChar.toUpperCase());
			ltrNode.appendChild(ltrNodeTextNode);
			selectList.selectArray.push(ltrNode);
		}
		
		selectList.insertSelectElements();
	},
	deleteGuessedLetter: function(ltr) {
		var i = selectList.getIndex(ltr);
		selectList.selectArray.splice(i+1, 1);
		selectList.letters.splice(i, 1);
		selectList.insertSelectElements();
	},
	insertSelectElements: function() {
		document.getElementById("select-letter").innerHTML = "";
		for( var u = 0; u < selectList.selectArray.length; u++){
			document.getElementById("select-letter").appendChild(selectList.selectArray[u]);
		}
	},
	selectArray: [],
	
};

function selectStyle(s) {
	document.getElementById("day-night-stylesheet").setAttribute("href", "assets/css/" + s + ".css");
}

window.onload = hangman.init;