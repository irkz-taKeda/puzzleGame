
export default class Cell {
	constructor(game, position, ms) {
		this.isEmpty = false;
		this.game = game;
		this.position = position;
		this.size = game.size;
		this.containerWidth = game.containerWidth;
		this.width = this.containerWidth / this.size;
		this.height = this.containerWidth / this.size;
		this.initialPosition = position;
		this.isEmpty = this.position === this.size * this.size - 1;
		this.cell = this.createCell();

		

		if (!this.isEmpty) {
			this.setImage();
		}
		this.initListeners();
		game.container.appendChild(this.cell);
	}

	createCell() {
		const cell = document.createElement('div');
		cell.className = `cell`; 
		cell.style.backgroundSize = `${this.containerWidth}px ${this.containerWidth}px`;
		cell.style.width = `${this.width}px`;
		cell.style.height = `${this.width}px`;
		cell.style.left = `${this.width * (this.position % this.size)}px`;
		cell.style.top = `${this.height * (Math.floor(this.position / this.size))}px`;
		if (this.isEmpty) {
			cell.style.border = 'none';
		} 
		return cell;
	}

	initListeners() {
		if (this.isEmpty) {
			return; 
		}
		const onClick = e => {
			const emptyCell = this.game.getEmptyCell();
			const {x, y} = this.getXY(this.position);
			const {x: emptyX, y: emptyY} = this.getXY(emptyCell.position);
			if ((x === emptyX || y === emptyY) && (Math.abs(x - emptyX) === 1 || Math.abs(y - emptyY) === 1)) {
				this.game.swapCells(this.initialPosition, emptyCell.initialPosition, 400);
				this.game.saveState();
			} else {
				e.target.classList.add('swing');
			}
		};
		const onAnimationEnd = e => {
			e.target.classList.remove('swing');
		};

		this.cell.addEventListener('click', onClick);
		this.cell.addEventListener('animationend', onAnimationEnd);

		this.removeListeners = () => {
			this.cell.removeEventListener('click', onClick);
			this.cell.removeEventListener('animationend', onAnimationEnd);
		};
	}

	destroy() {
		if (!this.isEmpty) {
			this.removeListeners();	
		}
	}

	setImage() {
		const {x,y} = this.getXY(this.initialPosition);
		const cellLeft = this.width * x;
		const cellTop = this.height * y;
		
		this.cell.style.backgroundImage = `url(${this.game.imageSrc})`;
		this.cell.style.backgroundPosition = `-${cellLeft}px -${cellTop}px`;
	}

	setTransitionDuration(ms) {
		this.cell.style['transition-duration'] = ms + 'ms';
	}

	setPosition(position) {
		this.position = position;
		const {left, top} = this.getPosition();
		this.cell.style.left = `${left}px`;
		this.cell.style.top = `${top}px`;
	}

	getPosition() {
		const {x,y} = this.getXY(this.position);
		return {
			left: this.width * x,
			top: this.height * y
		}
	}

	getXY(position) {
		return {
			x: position % this.size,
			y: Math.floor(position / this.size)
		}
	}
}