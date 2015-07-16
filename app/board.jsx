/**
 * @jsx React.DOM
 */

var Dispatcher = require("./dispatcher");


var Answer = React.createClass({
	render: function() {
		return (
		  	<ul id="answer" className="code list-unstyled">
				<li>?</li>
				<li>?</li>
				<li>?</li>
				<li>?</li>
    		</ul>
    	);
	}
})

var ColorButton = React.createClass({
	render: function() {
		return(
			<button type="button" onClick={this.clickHandler} className={this.getClassName()}>&nbsp;</button>
		);
	},
	getClassName: function(color) {
		return "btn btn-default btn-sm " + this.props.color;
	},
	clickHandler: function(event) {
		this.props.clickHandler(this.props.color);
	}
})

var CodePicker = React.createClass({
	render: function() {
		return (
			<div id="codepicker" className="well well-sm">
				<ColorButton color="white" clickHandler={this.onColorClicked}/>
				<ColorButton color="yellow" clickHandler={this.onColorClicked}/>
				<ColorButton color="red" clickHandler={this.onColorClicked}/>
				<ColorButton color="blue" clickHandler={this.onColorClicked}/>
				<ColorButton color="green" clickHandler={this.onColorClicked}/>
				<ColorButton color="black" clickHandler={this.onColorClicked}/>
			</div>
			);
	},
	onColorClicked: function(color) {
		this.props.onColorSelected(color);
	}
});

var CodeDisplay = React.createClass({
	render: function() {
		return (
			<ul className="code list-unstyled">
	          <li className={this.getClassName(0)}></li>
	          <li className={this.getClassName(1)}></li>
	          <li className={this.getClassName(2)}></li>
	          <li className={this.getClassName(3)}></li>
        	</ul>
			);
	},
	getClassName: function(peg) {
		if (!this.props.code)
			return '';

		return this.props.code[peg];
	}

})

var CodeSelector = React.createClass({
	render: function() {
		return (
			<ul className="code list-unstyled selectable">
	          <li key="0" className={this.getClassName(0)} onClick={this.pegClickHandler.bind(this, 0)}></li>
	          <li key="1" className={this.getClassName(1)} onClick={this.pegClickHandler.bind(this, 1)}></li>
	          <li key="2" className={this.getClassName(2)} onClick={this.pegClickHandler.bind(this, 2)}></li>
	          <li key="3" className={this.getClassName(3)} onClick={this.pegClickHandler.bind(this, 3)}></li>
        	</ul>
			);
	},
	isSelected: function(peg) {
		return this.props.currentPeg == peg;
	},
	pegClickHandler: function(peg){
		this.props.pegSelectionHandler(peg);
		//this.props.pegSelectionHandler(event.target.innerText);
	},
	getClassName: function(peg) {
		var className = '';

		if (this.props.code[peg])
			className = className + this.props.code[peg];

		if (this.isSelected(peg))
			className = className + ' selected';

		return className;
	}
})

var ScoreDisplay = React.createClass({
	render: function() {

		return (
			<ul className="score list-unstyled">
				<li className={this.getClassName(0)}>&nbsp;</li>
				<li className={this.getClassName(1)}>&nbsp;</li>
				<li className={this.getClassName(2)}>&nbsp;</li>
				<li className={this.getClassName(3)}>&nbsp;</li>
			</ul>
       	);
	},
	getClassName: function(peg) {
		return this.props.score[peg] || '';
	}
});

var AddGuessButton = React.createClass({
	render: function() {
		return (
			<button id="addguessbutton" type="button" disabled={!this.props.enabled} onClick={this.props.clickHandler} className="btn btn-xs btn-primary">
				<span className="glyphicon glyphicon-ok"></span>
			</button>
		);
	}
});

var Row = React.createClass({
	getInitialState: function() {
		return {currentPeg: 0, guess: [], guessComplete: false};
	},
	render: function() {
		return (
			<div>
				<div className="turn">
					<ul className="guess list-unstyled">
						<li>
							{this.props.isCurrent ? 
								<CodeSelector code={this.state.guess} 
												currentPeg={this.state.currentPeg}
												pegSelectionHandler={this.onPegSelected}/> :
								<CodeDisplay code={this.props.turn.guess}/>}
							{this.props.isCurrent ? 
								<AddGuessButton enabled={this.state.guessComplete} clickHandler={this.onAddGuessClicked}/> : ''}
							{this.props.turn.score ?
								<ScoreDisplay score={this.props.turn.score}/> : ''}
							
			        	</li>
		        	</ul>
		        	
	        	</div>
        		{this.props.isCurrent ? <CodePicker onColorSelected={this.onColorSelected}/> : ''}
        	</div>
			);
	},
	onColorSelected: function(color) {
		
		// store guess and advance peg
		this.state.guess[this.state.currentPeg] = color;
		var nextPeg = this.state.currentPeg < 3 ? this.state.currentPeg + 1 : 3;

		this.setState({ guess: this.state.guess, 
						currentPeg: nextPeg, 
						guessComplete: this.isComplete()});
		
	},
	onPegSelected: function(peg) {
		this.setState({currentPeg: peg});
	},
	isComplete: function() {
		return this.state.guess.length === 4;
	},
	onAddGuessClicked: function(event) {
		Dispatcher.trigger('guess', this.state.guess);
	}

});


var Board = React.createClass({ 
 
	render: function() { 

		var rows = [];
		for (var key in this.props.turns) {
			rows.push(<Row key={key} turn={this.props.turns[key]} isCurrent={this.isCurrentTurn(key)}/>);
		}

		return (
			<div>
				<Answer/>
				<div id="turns">
					{rows}
				</div>
				<button onClick={this.newGameClicked}>New Game</button>
			</div>
			);

	},
	isCurrentTurn: function(turn) {
		return (turn == this.props.current);
	},
	newGameClicked: function(event) {
		Dispatcher.trigger('newgame');
		return false;
	}

}); 

module.exports = Board;