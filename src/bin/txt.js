if (process.argv.length <= 1) {
	stdio.writeln('Usage: txt <file>');
} else {
	const filename = process.argv[1];
	txt(filename);
}
function calcCursorPos(str, termWidth = stdio.terminal.cols, termHeight = stdio.terminal.rows) {
	let pos = {x: 0, y: 0};
	for (const char of str) {
		switch (str) {
			case '\r':
				pos.x = 0;
				break;
			case '\n':
				++pos.y;
				break;
			default: 
				if (++pos.x === termWidth) {
					pos.x = 0;
					++pos.y;
				}
		}
	}
	return pos;
}
function txt(filename) {
	let text;
	let newfile = false;
	try {
		text = fs.read(filename);
	} catch (err) {
		if (err.code === 'ENOENT') {
			text = '';
			newfile = true;
		} else {
			throw err;
		}
	}
	let listening = false;
	stdio.write('\x1b[2J');
	let frame;
	let saved = false;
	function loop() {
		frame = requestAnimationFrame(loop);
		if (listening) return;
		listening = true;
		stdio.read().then(char => {
			stdio.write('\x1b[2J\x1b[0;0H');
			if (char === String.fromCharCode(127)) {
				stdio.write('\b \b');
				text = text.slice(0, -1);
			} else if (char === String.fromCharCode(24)) { 
				//Ctrl + X Exit
				stdio.write('\x1b[2J\x1b[0;0H');
				cancelAnimationFrame(frame);
				process.kill();
			} else if (char === String.fromCharCode(19)) {
				//Ctrl + S Save
				fs.write(filename, text);
				saved = true;
			} else if (char === '\r') {
				text += '\r\n'; //CRLF or LF?
			} else {
				text += char;
			}
			stdio.write(text + '\r\n\r\n');
			const msg = `${newfile ? 'New file' : ''} ${filename}${saved ? ' saved' : ''}. Ctrl + S to save, Ctrl + X to exit`;
			stdio.write('\x1b[47m\x1b[30m' + msg + '\x1b[0m');
			const cursorPos = calcCursorPos(text + ' ');
			stdio.write(`\x1b[${cursorPos.y};${cursorPos.x}H`);
			saved = false;
			listening = false;
		});
	}
	process.keepAlive();
	frame = requestAnimationFrame(loop);
}