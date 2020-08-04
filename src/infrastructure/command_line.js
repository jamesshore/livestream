// Copyright Titanium I.T. LLC.
"use strict";

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
	}

	args() {
		return this._process.argv.slice(2);
	}

	writeStdout(text) {
		this._process.stdout.write(text);
		this._lastStdout = text;
	}

	getLastStdout() {
		return this._lastStdout;
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