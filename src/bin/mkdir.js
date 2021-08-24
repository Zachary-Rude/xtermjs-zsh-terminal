if (process.argv.length <= 1) {
	stdio.writeln('Usage: mkdir <directory name>');
} else {
	for (const path of process.argv.slice(1)) {
		fs.mkdir(path);
	}
}