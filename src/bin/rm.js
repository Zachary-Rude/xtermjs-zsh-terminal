if (process.argv.length <= 1) {
	stdio.writeln('Usage: rm <files>');
} else {
	for (const file of process.argv.slice(1)) {
		fs.rm(file);
	}
}