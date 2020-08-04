// Copyright Titanium I.T. LLC.
"use strict";

const EventEmitter = require("events");

const STDOUT_EVENT = "stdout";

/** Wrapper for command-line processing */
module.exports = class CommandLine {

	static create() {
		return new CommandLine(process);
	}

	static createNull({ args = [] } = {}) {
		return new CommandLine(new NullProcess(args));
	}

	constructor(proc) {
		this._process = proc;
		this._lastStdout = null;
		this._emitter = new EventEmitter();
	}

	args() {
		return this._process.argv.slice(2);
	}

	writeStdout(text) {
		this._process.stdout.write(text);
		this._lastStdout = text;
		this._emitter.emit(STDOUT_EVENT, text);
	}

	getLastStdout() {
		return this._lastStdout;
	}

	onStdout(fn) {
		this._emitter.on(STDOUT_EVENT, fn);
		return () => {
			this._emitter.off(STDOUT_EVENT, fn);
		};
	}

};


class NullProcess {

	constructor(args) {
		this._args = args;
	}

	get argv() {
		return [ "null_process_node", "null_process_script.js", ...this._args ];
	}

	get stdout() {
		return {
			write() {}
		};
	}

}