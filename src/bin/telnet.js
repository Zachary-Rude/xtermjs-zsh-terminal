const proxy = 'tcp-relay.programmeruser.repl.co';
if (process.argv.length < 2) {
	stdio.writeln('Usage: telnet <host> <port (default 25)>');
} else {
	const host = process.argv[1];
	const port = process.argv[2] || 23;
	telnet(host, port);
}
function telnet(host, port) {
	process.keepAlive();
	const socket = new WebSocket(`wss://${proxy}/?url=${host}:${port}`);
	socket.binaryType = 'arraybuffer';
	socket.addEventListener('error', err => {
		throw err;
	})
	socket.addEventListener('close', event => {
		stdio.writeln('Connection closed');
	});
	socket.addEventListener('message', event => {
		const data = new Uint8Array(event.data);
		let str = '';
		data.forEach(byte => {
			str += String.fromCharCode(byte);
		});
		stdio.write(str);
	});
	socket.addEventListener('open', event => {
		stdio.writeln('Connected to ' + host);
		function loop() {
			if (socket.readyState !== WebSocket.OPEN) return;
			stdio.readline().then(data => {
				socket.send(data);
				loop();
			});
		}
		loop();
	});
}