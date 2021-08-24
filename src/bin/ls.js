if (process.argv.length <= 1) {
	const dir = process.cwd();
	stdio.writeln(fs.readdir(dir).join(' '));
} else {
	const dir = process.argv[1];
	stdio.writeln(fs.readdir(dir).join(' '));
}