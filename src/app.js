// Copyright Titanium I.T. LLC.
"use strict";

const score = require("./logic/score");
const CommandLine = require("./infrastructure/command_line");

const EXIT_CODE = {
	OK: 0,
	BAD_COMMAND_LINE: 1,
};

module.exports = class App {

	static create(commandLine = CommandLine.create()) {
		return new App(commandLine);
	}

	constructor(commandLine) {
		this._commandLine = commandLine;
	}

	run() {
		const args = this._commandLine.args();

		if (args.length !== 1) {
			this._commandLine.writeStderr(`Usage: ${this._commandLine.invokedCommand()} hand\n`);
			return EXIT_CODE.BAD_COMMAND_LINE;
		}

		const arg = args[0];

		try {
			this._commandLine.writeStdout(score.analyze(arg) + "\n");
			return EXIT_CODE.OK;
		}
		catch (err) {
			this._commandLine.writeStderr(err.message + "\n");
			return EXIT_CODE.BAD_COMMAND_LINE;
		}
	}

};