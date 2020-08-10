// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("../util/ensure");
const EventEmitter = require("events");

const STDOUT_EVENT = "stdout";
const STDERR_EVENT = "stderr";

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
		this._emitter = new EventEmitter();
	}

	args() {
		ensure.signature(arguments, []);
		return this._process.argv.slice(2);
	}

	writeStdout(text) {
		ensure.signature(arguments, [ String ]);
		this._process.stdout.write(text);
		this._lastStdout = text;
		this._emitter.emit(STDOUT_EVENT, text);
	}

	writeStderr(text) {
		ensure.signature(arguments, [ String ]);
		this._process.stderr.write(text);
		this._lastStderr = text;
		this._emitter.emit(STDERR_EVENT, text);
	}

	getLastStdout() {
		ensure.signature(arguments, []);
		return this._lastStdout;
	}

	getLastStderr() {
		ensure.signature(arguments, []);
		return this._lastStderr;
	}

	trackStdout() {
		return trackOutput(this._emitter, STDOUT_EVENT);
	}

	trackStderr() {
		return trackOutput(this._emitter, STDERR_EVENT);
	}

};

function trackOutput(emitter, event) {
	const output = [];
	const trackerFn = (text) => output.push(text);
	emitter.on(event, trackerFn);

	output.off = () => {
		output.consume();
		emitter.off(event, trackerFn);
	};
	output.consume = () => {
		const result = [ ...output ];
		output.length = 0;
		return result;
	};
	return output;
}


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