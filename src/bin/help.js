stdio.writeln(`Commands:
help: shows this help message
cd: changes the directory
clear: clears the screen
echo <message>: prilnts a message
ls <directory>: lists the contents of the directory and uses the current one if none are provided
zsh: start the Z shell
exit: exits the shell 
mkdir: create a new directory
pwd: print the current working directory
rm <files>: removes the files
rmdir <directories>: removes the directories
wget [-o --output <filename>] <url>: downloads a file
cat <files>: prints the contents of a file
wasm <files or urls>: runs a wasm program from a file or a url
fwritestr <file> <string>: write a string to a file
txt <file>: edit a text file`.replace(/\n/g, '\r\n'));