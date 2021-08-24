class Buffer extends Uint8Array {
	constructor(size) {
		super(size);
	}
	static alloc(size) {
		return new Buffer(size);
	}
	static from(data) {
		if (typeof data === 'string') {
			const buffer = new Buffer(data.length);
			for (let i = 0; i < data.length; ++i) buffer[i] = data[i].charCodeAt(0);
			return buffer;
		} else if (data instanceof Uint8Array) {
			const buffer = new Buffer(data.length);
			for (let i = 0; i < buffer.length; ++i) buffer[i] = data[i];
			return buffer;
		} else if (data instanceof Buffer) {
			return data;
		} else {
			return Buffer.from(new Uint8Array(data));
		}
	}
	copy(target) {
		for (let i = 0; i < target.length && i < this.length; ++i) {
			target[i] = this[i];
		}
	}
	compare(target) {
		if (this.length !== target.length) return false;
		let equals = true;
		for (let i = 0; i < this.length; ++i) {
			equals &&= this[i] === target[i];
		}
		return equals;
	}
	fill(value, offset = 0, end = this.length) {
		for (let i = offset; i < end; ++i) this[i] = value;
	}
	toString() {
		let str = '';
		for (let i = 0; i < this.length; ++i) {
			str += String.fromCharCode(this[i]);
		}
		return str;
	}
}
export default Buffer;