if (process.argv.length <= 1) {
	stdio.writeln('Usage: fwritestr <filename> <string>');
} else {
	const filename = process.argv[1];
	const str = process.argv.slice(2).join(' ');
	fs.write(filename, str);
}