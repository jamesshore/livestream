// Copyright Titanium I.T. LLC.
"use strict";

const path = require("path");

const CommandLine = module.exports = class CommandLine {

	static create() {
		return new CommandLine(process);
	}

	static createNull({
		args = [],
		invokedCommand = "null_process_node null_process_script.js",
	} = {}) {
		return new CommandLine(nullProcess(args, invokedCommand));
	}

	constructor(proc) {
		this._process = proc;
	}

	args() {
		return this._process.argv.slice(2);
	}

	invokedCommand() {
		const node = path.basename(this._process.argv[0]);
		const script = path.basename(this._process.argv[1]);
		return `${node} ${script}`;
	}

	writeOutput(text) {
		this._process.stdout.write(text);
		this._lastOutput = text;
	}

	getLastOutput() {
		return this._lastOutput;
	}

	writeError(text) {
		this._process.stderr.write(text);
	}

};


function nullProcess(args, invokedCommand) {
	const commandWords = invokedCommand.split(" ");
	if (commandWords.length !== 2) {
		throw new Error(`invokedCommand has wrong number of words; must be two, but was: "${invokedCommand}"`);
	}
	const [ nodeCommand, script ] = commandWords;


	return {
		argv: [ nodeCommand, script, ...args ],

		stdout: {
			write() {}
		},

		stderr: {
			write() {}
		},
	};
}