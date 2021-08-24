if (process.argv.length <= 1) {
	stdio.writeln('Usage: rmdir <directories>');
} else {
	for (const dir of process.argv.slice(1)) {
		fs.rmdir(dir);
	}
}