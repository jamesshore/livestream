// Copyright Titanium I.T. LLC.
"use strict";

module.exports = class CommandLine {

	static create() {
		return new CommandLine(process);
	}

	static createNull({ args = [] } = {}) {
		return new CommandLine(new NullProcess(args));
	}

	constructor(proc) {
		this._process = proc;
	}

	args() {
		return this._process.argv.slice(2);
	}

	writeOutput(text) {
		let output = text + "\n";
		this._process.stdout.write(output);
		this._lastOutput = output;
	}

	getLastOutput() {
		return this._lastOutput;
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