if (process.argv.length <= 1) {
	stdio.writeln('Usage: cd <directory>');
} else {
	const dir = process.argv[1];
	process.chdir(dir);
}