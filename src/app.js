// Copyright Titanium I.T. LLC.
"use strict";

const score = require("./logic/score");
const CommandLine = require("./infrastructure/command_line");
const commandLine = CommandLine.create();

module.exports = class App {

	static create() {
		return new App();
	}

	run() {
		const args = commandLine.args();

		if (args.length === 0) {
			commandLine.writeError(`Usage: ${commandLine.invokedCommand()} hand\n`);
			commandLine.exitWithCommandLineError();
		}

		const arg = args[0];

		try {
			commandLine.writeOutput(score.analyze(arg) + "\n");
			commandLine.exitWithoutError();
		}
		catch (err) {
			commandLine.writeError(err.message + "\n");
			commandLine.exitWithCommandLineError();
		}
	}

};