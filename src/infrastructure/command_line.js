// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("../util/ensure");

/** Wrapper for command-line processing */
module.exports = class CommandLine {

	static create() {
		ensure.signature(arguments, []);
		return new CommandLine(process);
	}

	static createNull({ args = [] } = {}) {
		ensure.signature(arguments, [[ undefined, { args: Array } ]]);
		return new CommandLine(new NullProcess(args));
	}

	constructor(proc) {
		this._process = proc;
		this._lastStdout = null;
		this._lastStderr = null;
	}

	args() {
		ensure.signature(arguments, []);
		return this._process.argv.slice(2);
	}

	writeStdout(text) {
		ensure.signature(arguments, [ String ]);
		this._process.stdout.write(text);
		this._lastStdout = text;
	}

	writeStderr(text) {
		ensure.signature(arguments, [ String ]);
		this._process.stderr.write(text);
		this._lastStderr = text;
	}

	getLastStdout() {
		ensure.signature(arguments, []);
		return this._lastStdout;
	}

	getLastStderr() {
		ensure.signature(arguments, []);
		return this._lastStderr;
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

	get stderr() {
		return {
			write() {}
		};
	}

}