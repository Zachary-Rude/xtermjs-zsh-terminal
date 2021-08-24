const proxy = 'https://cors.bridged.cc/';
if (process.argv.length <= 1) {
	stdio.writeln('Usage: wget [-o or --output output] url');
} else {
	const args = process.argv.slice(1);
	let url;
	let output;
	for (let i = 0; i < args.length; ++i) {
		const arg = args[i];
		if (arg.slice(0, 2) === '--') {
			const opt = arg.slice(2);
			switch (opt) {
				case 'output':
					output = args[++i];
					break;
				default:
					throw new Error('Unknown option: ' + arg);
			}
		} else if (arg[0] === '-') {
			const opt = arg.slice(1);
			switch (opt) {
				case 'o':
					output = args[++i];
					break;
				default:
					throw new Error('Unknown option ' + arg);
			}
		} else {
			url = arg;
		}
	}
	if (!url) throw new Error('No url specified');
	const parsedUrl = new URL(url);
	if (!output) {
		const pathname = parsedUrl.pathname === '/' ? parsedUrl.pathname.slice(0, -1) : parsedUrl.pathname;
		output = pathname.split('/').slice(-1)[0];
		if (!output) output = 'index.html';
	}
	fetch(proxy + url).then(res => res.arrayBuffer()).then(arraybuffer => {
		const arr = new Uint8Array(arraybuffer);
		fs.write(output, arr);
	});
}