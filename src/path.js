export function join(...paths) {
	return paths.reduce((res, curr) => {
		if (curr.slice(-1) !== '/') curr += '/';
		return curr + res;
	}, '');
}
export function resolve(path, cwd = '/') {
	if (path.slice(0, 2) === '..') return path.replace('..', cwd.slice(0, cwd.lastIndexOf('/'))) || '/';
	if (path[0] === '/') return path;
	if (path[0] === '.') return cwd === '/' ? path.slice(1) || '/' : path.replace('.', cwd);
	return cwd === '/' ? cwd + path : cwd + '/' + path;
}