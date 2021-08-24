const promptString = '-> ~ ';
let path_envvar = '/bin:';
let currentProcess = null;

const interruptListener = stdio.addListener(String.fromCharCode(3), () => {
	stdio.write('\r\n');
	if (currentProcess) currentProcess.kill();
	else stdio.write(promptString);
});
process.on('exit', () => {
	stdio.removeListener(String.fromCharCode(3), interruptListener);
});
process.on('error', err => {
	stdio.writeln(err.message);
});

shell();
function shell() {
	stdio.write(promptString);
	stdio.readline().then(cmd => {
		run(cmd, shell);
	});
}

function resolveExecutable(cmd) {
	cmd = cmd.slice(-3, cmd.length) === '.js' ? cmd.slice(0, -3) : cmd;
	if (cmd[0] === '.' || cmd[0] === '/' || cmd.split('/').length <= 0) return path.resolve(cmd, process.cwd());
	for (const dir of path_envvar.split(':')) {
		if (!dir) continue;
		try {
			fs.read(dir + '/' + cmd + '.js');
		} catch (err) {
			if (err.code === 'ENOENT') {
				continue;
			} else {
				stdio.writeln(err.message);
			}
		}
		return dir + '/' + cmd;
	}
	stdio.writeln(cmd + ': command not found');
	return null;
}

function run(cmd, callback = () => {}) {
	if (!(cmd.trim().length > 0)) {
		return callback(true);
	}
	if (cmd.trim() === 'exit') {
		stdio.removeListener(String.fromCharCode(3), interruptListener);
		return process.kill();
	}
	const argv = cmd.split(' ');
	argv[0] = resolveExecutable(argv[0]);
	if (!argv[0]) return callback(false);
	let success = true;
	try {
		currentProcess = new Process(argv.join(' '), process);
		currentProcess.on('error', err => {
			stdio.writeln(err.message);
			success = false;
		});
		currentProcess.on('exit', () => {
			currentProcess = null;
			callback(success); //callback's first argument is whether it succeeded
		});
	} catch (err) {
		stdio.writeln(err.message);
		callback(false);
	}
}
window.shell = { run, resolveExecutable };