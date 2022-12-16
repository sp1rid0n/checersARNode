/* клетка */
class Cell {
	constructor(i, j, black, parent) {
		
		this.i = i;
		this.j = j;
		this.black = black;
		this.parent = parent;
		
		let size = parent.size/8;

		this.el = document.createElement('a-plane');
		this.el.setAttribute('height', size);
		this.el.setAttribute('width', size);
		
		if (black) {
			this.el.setAttribute('color', '#FF9922');
			this.el.setAttribute('change-color-on-hover', 'color: green');
		} else {
			this.el.setAttribute('color', '#BBBBBB');
		}

		this.position = {x: (i-3)*size, y: (j-3)*size, z: 0}
		this.el.setAttribute('position', this.position);
		
		this.el.setAttribute('class', 'cell')
		this.el.setAttribute('id', `cell-${this.i}-${this.j}`)
		
		parent.el.appendChild(this.el);
	}
}

/* шашка */
class Checker {
	constructor(cell, color, parent) {
		let d = parent.size*0.05;
		
		this.cell = cell;

		this.i = cell.i;
		this.j = cell.j;
		
		this.el = document.createElement('a-cylinder');
		this.el.setAttribute('height', 0.1);
		this.el.setAttribute('radius', d);
		this.el.setAttribute('rotation', '-90 0 0');
		this.el.setAttribute('color', color);
		this.el.setAttribute('change-color-on-hover', 'color: blue');
		this.el.setAttribute('class', 'checker');
		this.el.setAttribute('id', `checker-${this.i}-${this.j}`);
		
		this.setOnCell(this.cell);

		parent.el.appendChild(this.el);
	}
	setOnCell(cell) {
		this.cell = cell;
		this.i = cell.i;
		this.j = cell.j;
		this.el.setAttribute('id', `checker-${this.i}-${this.j}`);
		this.el.setAttribute('position', cell.position);
	}
}

/* доска */
class Board {
	constructor(x, y, size=2) {
		this.cells = [];
		this.checkers = [];
		
		this.size = size;
		
		this.el = document.createElement('a-entity');
		this.el.setAttribute('position', {x: x, y: x, z: 0})
		this.el.setAttribute('rotation', '-90 90 0');
		
		document.getElementById('scene').appendChild(this.el);
		
		this.arrange();
	}

	arrange() {
		for (let i=0; i<8; i++) {
			for (let j=0; j<8; j++) {
				let black = ((i+j)%2==0);
				let cell = new Cell(i, j, black, this);
				this.cells.push(cell);
				
				if (black && i<3) {
					let checker = new Checker(cell, 'black', this);
					this.checkers.push(checker);
				} else if (black && i>4) {
					let checker =  new Checker(cell, 'white', this);
					this.checkers.push(checker);
				}
			}
		}
	}
}