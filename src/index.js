/** @format */

import { component } from './component.js';
import './style.css';
import { a } from './utility.js';

var idb = require('ahl-lib-idb');
var con = require('ahl-lib-con');

const app = document.getElementById('app');

let database = {
	instance: null,
	createDatabase() {
		idb.openDatabase('snake', 1, 'high_scores').then((db) => {
			database.instance = db;
		});
	},
	updateDatabase(newVal) {
		idb.readEntry(database.instance, 'high_scores', 'top_ten').then((db) => {
			!Array.isArray(db) && (db = []);
			db.push([game.state.playerName, newVal]);
			db.sort((a, b) => b[1] - a[1]);
			db.length > 5 && (db.length = 5);
			idb.replaceEntry(database.instance, 'high_scores', 'top_ten', db);
			document.querySelector('.scores').innerHTML = `High Scores: ${db
				.map((num) => `<h4>${num.join(':  ')}</h4>`)
				.join('')}`;
		});
	},
};

database.createDatabase();

let game = Object.create(component);

game.state = {
	playerName: null,
};

let grid = Object.create(component);

/*grid component*/
grid.state = {
	width: 25,
	height: 25,
	appleCoords: { x: 0, y: 0 },
	test: 5,
};
grid.init = function() {
	for (var i = 0; i < grid.state.width; ++i) {
		for (var j = 0; j < grid.state.height; ++j) {
			app.appendChild(document.createElement('div')).setAttribute('data-coords', [j, i]);
		}
	}
	return this;
};
grid.newApple = function() {
	grid.updateState({
		appleCoords: {
			x: a.randomInt(grid.state.width),
			y: a.randomInt(grid.state.height),
		},
	});
};
grid.render = function() {
	document.querySelector('.apple') && document.querySelector('.apple').classList.remove('apple');
	document
		.querySelector(`[data-coords="${grid.state.appleCoords.x},${grid.state.appleCoords.y}"]`)
		.classList.add('apple');
};

let trajectory = {
	ArrowUp: { x: 0, y: -1 },
	ArrowDown: { x: 0, y: 1 },
	ArrowLeft: { x: -1, y: 0 },
	ArrowRight: { x: 1, y: 0 },
};

/*snake component*/
let snake = Object.create(component);

snake.state = {
	head: null,
	currentPosition: null,
	nextPosition: [],
	direction: trajectory.ArrowDown,
	snakeLength: 1,
	timer: null,
	clear: true,
};
snake.init = function() {
	window.addEventListener('keydown', function(e) {
		let x = e.keyCode;
		trajectory[e.key].y != snake.state.direction.y * -1 &&
			trajectory[e.key].x != snake.state.direction.x * -1 &&
			(x == 37 || x == 38 || x == 39 || x == 40) &&
			//boolean 'clear' must be 'true' to change direction
			//clear is set to 'true' at end of setInterval
			snake.state.clear &&
			snake.updateState({ direction: trajectory[e.key], clear: false });
	});
	return this;
};
snake.checkHead = function() {
	/*snake dies?*/
	let alive = true;

	snake.state.currentPosition.some((s) => a.equalObjects(s, snake.state.head)) && (alive = false);

	(snake.state.head.x >= grid.state.width ||
		snake.state.head.x < 0 ||
		snake.state.head.y >= grid.state.height ||
		snake.state.head.y < 0) &&
		(alive = false);

	if (!alive) {
		database.updateDatabase(snake.state.snakeLength);
		menu.reset().render(menu.state.outro);
	}

	/*snake eats apple?*/
	a.equalObjects(snake.state.head, grid.state.appleCoords) && snake.eatApple();

	return this;
};
snake.moveSnake = function() {
	/*reset snake length to 1, after score screen*/
	snake.updateState({ snakeLength: 1 });

	snake.timer = window.setInterval(cb, 100);
	function cb() {
		/*compute new snake.state.head position*/
		snake
			.updateState({
				head: a.reduceObjects(snake.state.currentPosition[0], snake.state.direction),
			})
			.checkHead()
			.updateState({
				nextPosition: [snake.state.head].concat(snake.state.currentPosition).slice(0, snake.state.snakeLength),
			})
			.updateState({ currentPosition: snake.state.nextPosition, clear: true });
	}
};
snake.eatApple = function() {
	snake.updateState({ snakeLength: (snake.state.snakeLength += 1) });
	grid.newApple();
};
snake.render = function() {
	try {
		snake.state.currentPosition.forEach((pos) =>
			document.querySelector(`[data-coords="${pos.x},${pos.y}"]`).classList.remove('snake'),
		);
		snake.state.nextPosition.forEach((pos) =>
			document.querySelector(`[data-coords="${pos.x},${pos.y}"]`).classList.add('snake'),
		);
	} catch (e) {
		//eats uncaught type error "cannot read classList of null" if snake dies
		return null;
	}
};

let menu = Object.create(component);

menu.state = {
	intro: {
		title: `Welcome to snake!`,
		subtitle: `A recreation of a timeless classic, powered by pure JS`,
		button: `Let's go`,
	},
	outro: {
		title: `Your score is `,
		subtitle: `Thanks for stopping by!`,
		button: `Play again`,
	},
	link: `https://github.com/Alamansky/snake`,
};
menu.reset = function() {
	clearInterval(snake.timer);
	while (app.firstChild) {
		app.removeChild(app.firstChild);
	}
	snake.updateState({ currentPosition: [{ x: 12, y: 0 }], nextPosition: [], direction: trajectory.ArrowDown }, false);
	return this;
};
menu.start = function() {
	grid.init().newApple();
	snake.init().moveSnake();
};
menu.test = function() {
	game.updateState(
		{ playerName: a.getValue('[name="username"]') == '' ? 'Unknown Player' : a.getValue('[name="username"]') },
		false,
	);
	menu.reset().start();
};
menu.render = function(stage) {
	app.appendChild(document.createElement('div')).setAttribute('id', 'screen');
	var x = document.querySelector('#screen');

	x.innerHTML = `<h1 class="title">${stage.title}${stage == menu.state.outro ? snake.state.snakeLength : ``}</h1>
				   <h2 class="subtitle">${stage.subtitle}</h2>
				   <div class="scores"></div>
				   <h2 class="subtitle">Player Name:</h2>
				   <input type="text" name="username" id="username" value="Riki-Tiki-Tavi" autocomplete = "off" required="true" spellcheck="false"></input>
				   <button class="btn">${stage.button}</button>
				   <a href='${menu.state.link}' target="_new" class="link">Github Repo</a>`;

	document.querySelector('button').addEventListener('click', menu.test);
	//console.log(game.state.highScores);
};

menu.render(menu.state.intro);
