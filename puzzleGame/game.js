import Cell from './cell.js';

export default class Game {
	constructor(root,imageSrc, containerWidth, size) {
		this.root = root;
		this.imageSrc = imageSrc;
		this.containerWidth = containerWidth;
		this.containerHeight = containerWidth;
		this.size = size;
		this.cells = [];
		this.shuffling = false;
		this.container = this.createContainer();
		this.root.appendChild(this.container);
		this.freeze = false;

		this.initListeners();
	}

	saveState() {
		this.freeze = true;
		location.hash = Base64.encode(JSON.stringify({size: this.size, cells: this.reduceIndexes()}));
	};

	initListeners() {
		const onpopstate = event => {
			if (this.freeze || !location.hash) {
				this.freeze = false;
				return;
			}
			try {
				this.applyState(JSON.parse(Base64.decode(location.hash.slice(1))))
			} catch (e) {
				console.error(e);
			}	
		};

		window.addEventListener('popstate', onpopstate);

		this.removeListeners = () => {
			window.removeEventListener('popstate', onpopstate);
		}
	}

	destroy() {
		this.removeListeners();
		this.cells.forEach(cell => cell.destroy());
	}

	createContainer() {
		const container = document.createElement('div');
		container.className = "container";
		return container;
	}

	init(state) {
		for (let i = 0; i < this.size * this.size; i++) {
			this.cells.push(new Cell(this, i));
		}

		if (!state || !this.isStateValid(state)) {
			setTimeout(() => this.shuffle(), 1000);
		} else {
			this.applyState(state);
		}
			
	}

	applyState(state) {
		console.log('test');
		state.cells.forEach((elem, index) => {
			this.cells[index].setPosition(elem);
		});
	}

	reduceIndexes() {
		return this.cells.reduce((acc, curr, index) => {acc[index] = curr.position; return acc;}, new Array(this.size*this.size));
	}

	isStateValid(state) {
		if (!state || !Array.isArray(state.cells) || typeof state.size !== 'number') {
			return false;
		}
		const max = state.size * state.size - 1;
		if (state.cells.length !== max) {
			return false;
		} 
		const visited = {};
		return state.cells.every(pos => {
			if (pos < 0 || pos > max || visited[pos]) {
				return false;
			}
			visited[pos] = true; 
			return true;  
		});
	}

	shuffle() {
		this.shuffling = true;
		for (let i = this.cells.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			this.swapCells(i, j, 600);
		}
		this.shuffling = false;
		this.saveState();
	}

	swapCells(i, j, ms) {
		const iPosition = this.cells[i].position;
		const jPosition = this.cells[j].position;
		this.cells[i].setTransitionDuration(ms);
		this.cells[i].setPosition(jPosition);
		this.cells[j].setPosition(iPosition);

	
	}

	isAssembled() {
		for (let i = 0; i < this.cells.length; i++) {
			if (i === this.cells[i].position){
				return false;
			}
		}
		return true;
	}

	getEmptyCell() {
		return this.cells[this.cells.length - 1];
	}

}