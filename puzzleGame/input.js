
export default class Input {
	constructor(root) {
		this.root = root;

		this.root.appendChild(this.createInput());
	}

	createInput() {
		const input = document.createElement('input');
		input.className = 'slider';
		input.type = 'range';
		input.min = 5;
		input.max = 10;
		input.value = 5;
		return input;
	}
}