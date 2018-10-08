var hangman = {
	wins: 0,
	losses: 0,
	guesses: 10,
	answer: "",
	guessedWord: [],
	guessedLetters: [],
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
		//document.getElementById("guesses").innerHTML = hangman.guesses;
	},
	placeBlanks: function() {
		document.getElementById("word").innerHTML = "";
		for( var i = 0; i < hangman.answer.length; i++ ) {
			var node = document.createElement("SPAN");
			node.setAttribute("id", "answer-" + i);
			var textNode = document.createTextNode("_");
			node.appendChild(textNode);
			if(hangman.answer[i] == " ") {
				var b = document.createElement("BR");
				document.getElementById("word").appendChild(b);
			} else {
				document.getElementById("word").appendChild(node);
			}
		}
	},
	isGuessedLetter: function(ltr) {
		for( var u = 0; u < hangman.guessedLetters.length; u++ ) {
			if( ltr == hangman.guessedLetters[u] ) {
				return true;
			}
		}
		return false;
	},
	guess: function(ltr) {				
		var wrongGuess = 0;
		
		if( hangman.isGuessedLetter(ltr) ) {
			// do nothing. already guessed that.
		} else {
			hangman.guessedLetters.push(ltr);
			for(var t = 0; t < hangman.answer.length; t++ ) {
				if( ltr === hangman.answer[t] ) {
					document.getElementById("answer-" + t).innerHTML = ltr;
					hangman.guessedWord[t] = ltr;
				} else {
					wrongGuess++;
				}
				document.getElementById("guess-" + ltr).style.display = "none";
			}
			if( wrongGuess == hangman.answer.length ) {
				hangman.guesses--;
				svgAnimator.draw(hangman.guesses);
				//hangman.placeGuessesRemaining();
			}
			if( hangman.answer == hangman.guessedWordStr() && hangman.guesses > 0) {
				hangman.win();
			} else if(hangman.guesses == 0) {
				hangman.lose();
			}
		}
		
	},
	win: function() {
		document.getElementById("win-lose").innerHTML = "You win!";
		document.getElementById("win-lose").style.visibility = "visible";
		document.getElementById("guess-input").children[0].disabled = true;
		document.getElementById("new-game").children[0].style.visibility = "visible";
		hangman.wins++;
		hangman.saveScore();
	},
	lose: function() {
		document.getElementById("win-lose").innerHTML = "You lose!";
		document.getElementById("win-lose").style.visibility = "visible";
		document.getElementById("guess-input").children[0].disabled = true;
		document.getElementById("new-game").children[0].style.visibility = "visible";
		for(var t = 0; t < hangman.answer.length; t++ ) {
			document.getElementById("answer-" + t).innerHTML = hangman.answer[t] + " ";
		}
		hangman.losses++;
		hangman.saveScore();
	},
	saveScore: function() {
		save_cookies("wins", hangman.wins);
		save_cookies("losses", hangman.losses);
		hangman.printScore();
	},
	printScore: function() {
		document.getElementById("score-wins").innerHTML = "Wins: " + hangman.wins;
		document.getElementById("score-losses").innerHTML = "Losses: " + hangman.losses;	
	},
	showGuessedLetters: function() {
		var guessedLetterChildren = document.getElementById("guessed-letters").children;
		for( var i = 0; i < guessedLetterChildren.length; i++ ) {
			guessedLetterChildren[i].style.display = "inline";
		}
	},
	init: function() {
		var s = get_cookie("style");
		if( s != "" ) {
			selectStyle(s);
		} else {
			selectStyle("day");
		}
		var w = get_cookie("wins");
		if( w == "" ) {
			hangman.wins = 0;
		} else {
			hangman.wins = w;
		}
		var l = get_cookie("losses");
		if( l == "" ) {
			hangman.losses = 0;
		} else {
			hangman.losses = l;
		}
		hangman.printScore();
		
		document.getElementById("win-lose").style.visibility = "hidden";
		hangman.chooseWord();
		hangman.guesses = 10;
		hangman.placeBlanks();
		hangman.showGuessedLetters();
		hangman.guessedWord = [];
		hangman.guessedLetters = [];
		document.getElementById("new-game").children[0].style.visibility = "hidden";
		document.getElementById("guess-input").children[0].disabled = false;
		document.getElementById("guess-input").children[0].focus();
		svgAnimator.draw(hangman.guesses);
	}
};

var svgAnimator = {
	draw: function(x) {
		if( x == 10 ) {
			for( var i = 0; i < 10; i++ ) {
				var path = document.querySelector('#svg_' + i);
				var length = path.getTotalLength();
				// Clear any previous transition
				path.style.transition = path.style.WebkitTransition =
				  'none';
				// Set up the starting positions
				path.style.strokeDasharray = length + ' ' + length;
				path.style.strokeDashoffset = '0';
				// Trigger a layout so styles are calculated & the browser
				// picks up the starting position before animating
				path.getBoundingClientRect();
				// Define our transition
				path.style.transition = path.style.WebkitTransition =
				  'stroke-dashoffset 2s ease-in-out';
				// Go!
				path.style.strokeDashoffset = length;
			}
		} else {
			var path = document.querySelector('#svg_' + x);
			var length = path.getTotalLength();
			// Clear any previous transition
			path.style.transition = path.style.WebkitTransition =
			  'none';
			// Set up the starting positions
			path.style.strokeDasharray = length + ' ' + length;
			path.style.strokeDashoffset = length;
			// Trigger a layout so styles are calculated & the browser
			// picks up the starting position before animating
			path.getBoundingClientRect();
			// Define our transition
			path.style.transition = path.style.WebkitTransition =
			  'stroke-dashoffset 2s ease-in-out';
			// Go!
			path.style.strokeDashoffset = '0';
		}
	}
};

function save_cookies(key, value) {
	var exdays = 120; // cookies will expire in 120 days
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires=" + d.toGMTString();
	// save cookies with expiration date
	document.cookie = key + "=" + value + ";" + expires;
}

function get_cookie(key) {
	var name = key + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function isLetter(str) {
	return str.length === 1 && str.match(/[a-z]/i);
}

function processInput(ltr) {
	var l = ltr[0]; // in case of fast typing, grab only first char
	if(l != undefined) { // fast typing results in undefined
		if( isLetter(l) ) {
			l = l.toLowerCase(); // convert to lower case letter
			hangman.guess(l);
		}
	}
	document.getElementById("guess-input").children[0].value = "";
}

function selectStyle(s) {
	save_cookies("style", s);
	document.getElementById("day-night-stylesheet").setAttribute("href", "assets/css/" + s + ".css");
	document.getElementById("status-bar-meta").setAttribute("content", "black");
}

function scrollTopFunction() {
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

window.onload = hangman.init;