class Process {
	constructor(command, parent = null) {
		this.listeners = {
			exit: [],
			error: []
		};

		this.command = command;
		this.argv = command.split(' ');

		let cwd = parent ? parent.cwd() : '/home/user';
		this.cwd = () => cwd;
		this.chdir = dir => {
			cwd = path.resolve(dir, cwd);
			parent ? parent.chdir(dir) : null;
		};

		const code = fs.read(this.argv[0].slice(-3, this.argv[0].length) === '.js' ? this.argv[0] : this.argv[0] + '.js').toString();
		//set timeout is used so that it runs async and it can be cancelled
		const processFunction = new Function('process', 'fs', code);
		const modifiedFs = new Proxy(fs, {
			get: (target, prop, reciever) => {
				if (typeof fs[prop] !== 'function') return fs[prop];
				return function (...args) {
					return fs[prop].apply(fs, 
					prop === 'write'
					? [path.resolve(args[0], cwd), args[1]]
					: args.map(arg => path.resolve(arg, cwd))
					);
				}
			}
		});
		this.keepRunning = false;
		this.timeout = setTimeout(() => {
			try {
				processFunction(this, modifiedFs); //process argument and a modified version of fs that resolves paths
			} catch (err) {
				this.keepRunning = false;
				this.listeners.error.forEach(callback => callback(err));
				this.listeners.exit.forEach(callback => callback());
				return;
			}
			//check if keepalive is called
			if (this.keepRunning) {
				function poll() {
					if (this.keepRunning) return requestAnimationFrame(poll.bind(this));
					this.finished = true;
					this.listeners.exit.forEach(callback => callback());
				}
				requestAnimationFrame(poll.bind(this));
				return;
			}
			this.finished = true;
			this.listeners.exit.forEach(callback => callback());
		}, 0);
	}
	kill() {
		clearTimeout(this.timeout);
		this.keepRunning = false;
		this.finished = true;
		this.listeners.exit.forEach(callback => callback());
	}
	keepAlive() {
		this.keepRunning = true;
	}
	on(event, callback = () => {}) {
		this.listeners[event] = this.listeners[event] || [];
		this.listeners[event].push(callback);
	}
}
export default Process;
