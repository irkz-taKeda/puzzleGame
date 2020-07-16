import Game from './game.js';
import Input from './input.js';
import Cell from './cell.js';

const root = document.getElementById('root');
const input = new Input(root);
const slider = document.querySelector('.slider');
let state;
let game;

try {
	if (location.hash) {
		state = JSON.parse(Base64.decode(location.hash.slice(1)));
		slider.value = state.size;
	}
} catch (e) {
	console.log('Shit');
}

const initGame = (initialState) => {
	if (game) {
		game.destroy();
	}
	game = new Game(
		root,
		"https://cs.pikabu.ru/images/jobseeker/logo2.png",
		400,
		Number(slider.value)
		);

	game.init(initialState);
};

slider.addEventListener('input', e => {
	if (document.querySelector('.container')) {
		root.removeChild(document.querySelector('.container'));
	}
	initGame();
});

initGame(state);


