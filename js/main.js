'use strict';
const MAX_ENEMY = 7;
// объявление переменных
const score = document.querySelector('.score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.gameArea');
const car = document.createElement('div');
const scoreRecord = 0;
// добавление музыки вариант 1
// const music = document.createElement('embed');
// music.src = 'audio.mp3'
// скрытие элемента
// music.classList.add('visually-hidden');

// добавление музыки вариант 2
const music = new Audio('music/forsage.mp3');
const accident = new Audio('music/accident.mp3');
// console.dir(music); поиск элемента


car.classList.add('car');
start.addEventListener('click', startGame);
// отслеживание событий
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false,
};

const setting = {
	start: false,
	score: 0,
	speed: 5,
	traffic: 2.5,
}
function getQuantityElementElements(heightElement) {
	return document.documentElement.clientHeight / heightElement +1;
}
const getRandomEnemy = (max) => Math.floor((Math.random() * max) + 1);

// const getRandomEnemy = (max) => Math.floor((Math.random() * max));



function startGame() {
	music.play();
	start.classList.add('hide');
	gameArea.innerHTML = '';
	for (let i = 0; i < getQuantityElementElements(100); i++) {
		const line = document.createElement('div');
		line.classList.add('line');
		line.style.top = (i * 100) + 'px';
		line.y = i * 100;
		gameArea.appendChild(line);
	}

	for (let i = 0; i < getQuantityElementElements(100 * setting.traffic); i++) {
		const enemy = document.createElement('div');
		enemy.classList.add('enemy');
		enemy.y = -100 * setting.traffic * (i + 1);
		enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
		enemy.style.top = enemy.y + 'px';
		enemy.style.background = `
    transparent url(./img/enemy${getRandomEnemy(MAX_ENEMY)}.png) 
    center / cover 
    no-repeat `;
		gameArea.appendChild(enemy);
	}
	setting.score = 0;
	setting.start = true;
	gameArea.appendChild(car);
	// car.style.left = gameArea.offsetWidth/2 - car.offsetWidth/2;
	car.style.left = '125px';
	car.style.bottom = '10px'
	car.style.top = 'auto';
	setting.x = car.offsetLeft;
	setting.y = car.offsetTop;
	requestAnimationFrame(playGame);
}

function playGame() {
	if (setting.start) {
		setting.score += setting.speed;
		score.innerHTML = 'SCORE<br>' + setting.score;
		moveRoad();
		moveEnemy();
		if (keys.ArrowLeft && setting.x > 0) {
			setting.x -= setting.speed;
		}
		if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
			setting.x += setting.speed;
		}
		if (keys.ArrowUp && setting.y > 0) {
			setting.y -= setting.speed;
		}
		if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
			setting.y += setting.speed;
		}
		car.style.left = setting.x + 'px';
		car.style.top = setting.y + 'px';
		requestAnimationFrame(playGame);
	}
}

function startRun(event) {
	event.preventDefault();
	keys[event.key] = true;
	// проверка чтоб не заполнялись лишние клавиши
}

function stopRun(event) {
	event.preventDefault();
	keys[event.key] = false;
}
function moveRoad() {
	let lines = document.querySelectorAll('.line');
	lines.forEach(function (line) {
		line.y += setting.speed;
		line.style.top = line.y + 'px';
		if (line.y >= document.documentElement.clientHeight) {
			line.y = -100;
		}
	});
}
function moveEnemy() {
	let enemy = document.querySelectorAll('.enemy');
	enemy.forEach(function (item) {
		let carRect = car.getBoundingClientRect(); 
		let enemyRect = item.getBoundingClientRect();

		if(carRect.top <= enemyRect.bottom &&
			carRect.right >= enemyRect.left &&
			carRect.left <= enemyRect.right &&
			carRect.bottom >= enemyRect.top) {
				setting.start = false;
				console.warn('ДТП');
				music.pause();
				accident.play();
				start.classList.remove('hide');
				start.style.top = score.offsetHeight;
				music.remove('embed'); 
			}

		item.y += setting.speed / 2;
		item.style.top = item.y + 'px';
		if (item.y >= document.documentElement.clientHeight) {
			item.y = -100 * setting.traffic;
			item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
		}
	});
}

// item.y = -150 * setting.traffic;
// путь с ../ на /