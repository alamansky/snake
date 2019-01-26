/** @format */

import { component } from './component.js';
import './style.css';
import { a } from './utility.js';

const app = document.getElementById('app');

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
			snake.state.clear &&
			snake.updateState({ direction: trajectory[e.key], clear: false });
		/*console.log(`trajectory is: ${JSON.stringify(trajectory[e.key])}`);*/
	});
	return this;
};

snake.checkHead = function() {
	/*snake dies?*/
	/*console.log(`current pos: ${JSON.stringify(snake.state.currentPosition)}, head: ${JSON.stringify(snake.state.head)}`);*/
	snake.state.currentPosition.some((s) => s.x == snake.state.head.x && s.y == snake.state.head.y) &&
		menu.reset().render(menu.state.outro);

	snake.state.head.x >= grid.state.width ||
	snake.state.head.x < 0 ||
	snake.state.head.y >= grid.state.height ||
	snake.state.head.y < 0
		? menu.reset().render(menu.state.outro)
		: null;

	/*snake eats apple?*/
	snake.state.head.x == grid.state.appleCoords.x && snake.state.head.y == grid.state.appleCoords.y && snake.eatApple();

	return this;
};

snake.moveSnake = function() {
	snake.updateState({ snakeLength: 1 });
	snake.timer = window.setInterval(cb, 100);
	function cb() {
		/*compute new snake.state.head position*/
		snake
			.updateState({
				head: {
					x: snake.state.currentPosition[0].x + snake.state.direction.x,
					y: snake.state.currentPosition[0].y + snake.state.direction.y,
				},
			})
			.checkHead()
			.updateState({
				nextPosition: [snake.state.head].concat(snake.state.currentPosition).slice(0, snake.state.snakeLength),
			})
			.updateState({ currentPosition: snake.state.nextPosition })
			.updateState({ clear: true });
	}
};

snake.eatApple = function() {
	snake.updateState({ snakeLength: (snake.state.snakeLength += 1) });
	grid.newApple();
};

snake.render = function() {
	snake.state.currentPosition.forEach((pos) =>
		document.querySelector(`[data-coords="${pos.x},${pos.y}"]`).classList.remove('snake'),
	);
	snake.state.nextPosition.forEach((pos) =>
		document.querySelector(`[data-coords="${pos.x},${pos.y}"]`).classList.add('snake'),
	);
};

let menu = Object.create(component);

menu.state = {
	//stage: ["before", "during", "after"]
	intro: {
		title: `Welcome to snake!`,
		body: `A recreation of a timeless classic, powered by pure JS`,
		button: `Let's go`,
	},
	outro: {
		title: `Your score is `,
		body: `Thanks for stopping by. The nostalgia is on the house. :)`,
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
	//menu.reset();
	grid.init().newApple();
	snake.init().moveSnake();
};

menu.test = function() {
	menu.reset().start();
};

menu.render = function(stage) {
	app.appendChild(document.createElement('div')).setAttribute('id', 'screen');
	var x = document.querySelector('#screen');

	x.innerHTML = `<h1 class="title">${stage.title}${stage == menu.state.outro ? snake.state.snakeLength : ``}</h1>
				   <h2 class="subtitle">${stage.body}</h2>
				   <button class="btn">${stage.button}</button>
				   <a href='${menu.state.link}' target="_new" class="link">Github Repo</a>`;

	document.querySelector('button').addEventListener('click', menu.test);
};

/*kick off the menu*/
//grid.init();
//snake.init();

menu.render(menu.state.intro);
