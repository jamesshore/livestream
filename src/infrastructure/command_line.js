// Copyright Titanium I.T. LLC.
"use strict";

const path = require("path");

const CommandLine = module.exports = class CommandLine {

	static create() {
		return new CommandLine();
	}

	args() {
		return process.argv.slice(2);
	}

	invokedCommand() {
		const node = path.basename(process.argv[0]);
		const script = path.basename(process.argv[1]);
		return `${node} ${script}`;
	}

	writeOutput(text) {
		process.stdout.write(text);
	}

	writeError(text) {
		process.stderr.write(text);
	}

};
