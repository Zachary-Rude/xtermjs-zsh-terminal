import Filesystem from './fs.js';
import Buffer from './buffer.js';
import Process from './process.js';
import * as stdio from './stdio.js';
import * as path from './path.js';

//API
window.fs = new Filesystem();
window.Buffer = Buffer;
window.Process = Process;
window.stdio = stdio;
window.path = path;

//copy files into virtual filesystem
fs.mkdir('bin');
const bin = ['zsh', 'clear', 'ls', 'echo', 'cd', 'help', 'pwd', 'mkdir', 'rm', 'rmdir', 'wget', 'cat', 'wasm', 'fwritestr', 'txt', 'telnet'];
const promises = [];
for (const file of bin) {
	promises.push(fetch(`/src/bin/${file}.js`)
	.then(res => res.text())
	.then(code => fs.write(`/bin/${file}.js`, code)));
}
//some more essentials
fs.mkdir('etc');
fs.mkdir('etc/pkg');
fs.write('/etc/pkg/sources.json', '["]')
Promise.all(promises).then(() => {
	const zsh = new Process('/bin/zsh');
}).catch(err => {
	throw err;
});