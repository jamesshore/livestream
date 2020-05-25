// Copyright Titanium I.T. LLC.
"use strict";

module.exports = class CommandLine {

	static create() {
		return new CommandLine();
	}

	args() {
		return process.argv.slice(2);
	}

	writeOutput(text) {
		process.stdout.write(text + "\n");
	}

};
