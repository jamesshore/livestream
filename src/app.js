// Copyright Titanium I.T. LLC.
"use strict";

const score = require("./logic/score");
const CommandLine = require("./infrastructure/command_line");

module.exports = class App {

	static create(commandLine = CommandLine.create()) {
		return new App(commandLine);
	}

	constructor(commandLine) {
		this._commandLine = commandLine;
	}

	run() {
		const args = this._commandLine.args();

		if (args.length === 0) {
			this._commandLine.writeError(`Usage: ${this._commandLine.invokedCommand()} hand\n`);
			this._commandLine.exitWithCommandLineError();
		}

		const arg = args[0];

		try {
			this._commandLine.writeOutput(score.analyze(arg) + "\n");
			this._commandLine.exitWithoutError();
		}
		catch (err) {
			this._commandLine.writeError(err.message + "\n");
			this._commandLine.exitWithCommandLineError();
		}
	}

};