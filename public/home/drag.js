let board = new Board(0, 0);

const socket = new WebSocket("wss://ws-server-template.kupaqu.repl.co", "very-good-protocol");

socket.onmessage = message => {
	console.log(message);
	let data = JSON.parse(message.data);
	let checker = document.getElementById(data['checker']);
	let cell = document.getElementById(data['cell']);
	let cellId = cell.getAttribute('id').split('-');
	checker.setAttribute('position', cell.getAttribute('position'));
	checker.setAttribute('id', `checker-${cellId[1]}-${cellId[2]}`);
};


let selectedCell = null;
let selectedChecker = null;

/*	0 - ничего не выбрано
	1 - выбрана шашка и помещена в переменную selectedChecker */

let mode = 0;

AFRAME.registerComponent('change-color-on-hover', {
	schema: {
		color: { default: 'red' }
	},

	init: function() {
		var data = this.data;
		var el = this.el;
		var defaultColor = el.getAttribute('material').color;

		el.addEventListener('click', function() {
			el.setAttribute('color', 'red');

			if (mode == 0 && el.getAttribute('class') == 'checker') {
				selectedChecker = el;
				mode = 1;
			} else if (mode == 1 && el.getAttribute('class') == 'checker') {
				selectedChecker = el;
				mode = 1;
			} else if (mode == 1 && el.getAttribute('class') == 'cell') {
				selectedCell = el;
				cellId = el.getAttribute('id').split('-');
				if (document.getElementById(`checker-${cellId[1]}-${cellId[2]}`) != null) {
					console.log('collision!');
				} else {
					socket.send(JSON.stringify({
						checker: selectedChecker.getAttribute('id'),
						cell: `cell-${cellId[1]}-${cellId[2]}`,
					}));
					mode = 0;
				}
			}
		});
		el.addEventListener('mouseenter', function() {
			el.setAttribute('color', data.color);
		});
		el.addEventListener('mouseleave', function() {
			el.setAttribute('color', defaultColor);
		});
	}
});