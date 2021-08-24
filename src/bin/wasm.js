const proxy = 'https://cors.bridged.cc/';
if (process.argv.length <= 1) {
	stdio.writeln('Usage: wasm <files or urls>');
} else {
	for (const location of process.argv.slice(1)) {
		let isUrl = true;
		try {
			new URL(location);
		} catch (err) {
			isUrl = false;
		}
		if (isUrl) {
			WebAssembly.instantiateStreaming(fetch(proxy + location)).then(result => {
				stdio.writeln('\x1b[32m=> ' + result.instance.exports.main() + '\x1b[0m');
			});
		} else {
			const buffer = fs.read(location);
			const wasmModule = new WebAssembly.Module(buffer);
			const wasmInstance = new WebAssembly.Instance(wasmModule);
			stdio.writeln('\x1b[32m=> ' + wasmInstance.exports.main() + '\x1b[0m');
		}
	}
}