import Buffer from './buffer.js';
class FileError extends Error {
	constructor(msg, code) {
		super(msg);
		this.name = 'FileError';
		this.code = code;
	}
}
function getDirnames(path) {
	let dirs = path.split('/');
	dirs = dirs.filter(dir => !!dir);
	return dirs;
}
function getFilename(path) {
	const dirs = getDirnames(path);
	return dirs.slice(-1)[0];
}
class Filesystem {
	constructor() {
		this.files = {};
	}
	getParentDir(path) {
		const dirs = getDirnames(path);
		let dir = this.files;
		for (const item of dirs.slice(0, -1)) {
			if (!dir[item]) throw new FileError('ENOENT: No such file or directory ' + path, 'ENOENT');
			dir = dir[item];
		}
		return dir;
	}
	getFile(path) {
		return this.getParentDir(path)[getFilename(path)];
	}
	write(path, data) {
		const dir = this.getParentDir(path);
		const filename = getFilename(path);
		if (!(dir[filename] instanceof Buffer || dir[filename] === undefined || dir[filename] === null)) throw new FileError('EISDIR: Invalid operation on a directory ' + path, 'EISDIR');
		dir[filename] = Buffer.from(data);
	}
	read(path) {
		const file = this.getFile(path);
		if (!file) throw new FileError('ENOENT: No such file or directory ' + path, 'ENOENT');
		if (!(file instanceof Buffer)) throw new FileError('EISDIR: Invalid operation on a directory ' + path, 'EISDIR');
		return file;
	}
	mkdir(path) {
		const dir = this.getParentDir(path);
		const dirname = getFilename(path);
		dir[dirname] = {};
	}
	readdir(path) {
		if (path === '/') return Object.keys(this.files); //special case
		const dir = this.getFile(path);
		if (!dir) throw new FileError('ENOENT: No such file or directory ' + path, 'ENOENT');
		if (dir instanceof Buffer) throw new FileError(`ENOTDIR: ${path} is not a directory`, 'ENOTDIR');
		return Object.keys(dir);
	}
	rm(file) {
		const dir = this.getParentDir(file);
		const filename = getFilename(file);
		if (!dir[filename]) throw new FileError('ENOENT: No such file or directory ' + file, 'ENOENT');
		if (!(dir[filename] instanceof Buffer)) throw new FileError('EISDIR: Invalid operation on a directory ' + file, 'EISDIR');
		delete dir[filename];
	}
	rmdir(path) {
		if (path === '/') throw new FileError('Cannot remove /', 'ERR');
		const dir = this.getParentDir(path);
		const dirname = getFilename(path);
		if (!dir[dirname]) throw new FileError('ENOENT: No such file or directory ' + path, 'ENOENT');
		if(dir[dirname] instanceof Buffer) throw new FileError('ENOTDIR: ' + path + ' is not a directory', 'ENOTDIR');
		if (Object.keys(dir[dirname]).length <= 0) throw new FileError('ENOTEMPTY: ' + path + 'is not empty', 'ENOTEMPTY');
		delete dir[dirname];
	}
	symlink(from, to) {
		const fromDir = this.getParentDir(from);
		const toDir = this.getParentDir(to);
		const fromName = getFilename(from);
		const toName = getFilename(to);
		toDir[toName] = fromDir[fromName];
	}
}
export default Filesystem;