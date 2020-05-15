// Copyright Titanium I.T. LLC.
"use strict";

const score = require("./logic/score");
const commandLine = require("./infrastructure/command_line");

try {
	const arg = commandLine.args()[0];
	commandLine.writeOutput(score.analyze(arg) + "\n");
	commandLine.exitWithoutError();
}
catch (err) {
	commandLine.writeError(err.message + "\n");
	commandLine.exitWithCommandLineError();
}