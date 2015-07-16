var Board = require("./board");
var Dispatcher = require("./dispatcher");

var server = "http://tomv-mastermind.herokuapp.com";

var gameId = null;
var currentTurn = 0;
var turns = [];


var setupGame = function (createdGameId) {
	console.log('setupgame');
	gameId = createdGameId;
	turns = [];
	for(var i = 0; i < 12; i++) {
	    turns.push({});
	}
	currentTurn = 0;
	render();
}

var render = function() {
	React.renderComponent(
		Board({turns: turns, current: currentTurn}),
		document.getElementById('board')
	);
};

var createGame = function() {
	$.post(server + '/game', setupGame);
}

var submitGuess = function(code) {
	$.post(server + '/game/' + gameId + '/guesses', {'colors[]': code}).done(onGuessAdded);
}

var onGuessAdded = function(score) {
	turns[currentTurn-1].score = score;
	render();
}

Dispatcher.on('guess', function(code) {
	
	submitGuess(code);

	turns[currentTurn].guess = code;
	currentTurn++;
	render();
});

Dispatcher.on('newgame', function() {
	createGame();
})


createGame();
render();

