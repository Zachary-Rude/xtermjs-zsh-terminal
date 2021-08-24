const term = new Terminal({ fontFamily: 'Consolas, Cousine, monospace' });
term.open(document.getElementById('terminal'));
let acceptingInput = false;
let currentInput = '';
const listeners = {};

function addListener(key, callback) {
	const id = Math.floor(Math.random() * 9999);
	listeners[key] = listeners[key] || [];
	listeners[key].push({
		id,
		callback
	});
	return id;
}
function removeListener(key, id) {
	for (const [index, listener] of listeners[key].entries()) {
		if (!listener) continue;
		if (listener.id === id) {
			listeners[key][index] = null;
		}
	}
}
function write(data) {
	term.write(data);
}
function writeln(data) {
	term.writeln(data);
}
function read(n = 1) {
	return new Promise((resolve, reject) => {
		let res = '';
		let i = 0;
		term.onData(data => {
			res += data;
			++i;
			if (i === n) {
				resolve(res);
			}
		});
	});
}
function readline() {
	acceptingInput = true;
	return new Promise((resolve, reject) => {
		const id = addListener('\r', () => {
			removeListener('\r', id);
			acceptingInput = false;
			resolve(currentInput);
			currentInput = '';
		});
	});
}

term.onData(data => {
	if (listeners[data]) {
		listeners[data].forEach(item => {
			if (item) item.callback();
		});
	} else {
		if (acceptingInput) currentInput += data;
		term.write(data);
	}
});

addListener('\r', () => {
	term.write('\r\n');
});

addListener(String.fromCharCode(127), () => {
	if (!acceptingInput || currentInput === '') return;
	term.write('\b \b');
	currentInput = currentInput.slice(0, -1);
});

export { addListener, removeListener, write, writeln, read, readline, term as terminal };