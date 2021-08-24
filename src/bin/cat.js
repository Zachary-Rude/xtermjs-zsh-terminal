if (process.argv.length <= 1) {
	stdio.writeln('Usage: cat <files(s)>');
} else {
	for (const file of process.argv.slice(1)) {
		stdio.writeln(fs.read(file).toString());
	}
}