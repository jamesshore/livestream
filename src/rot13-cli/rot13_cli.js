// Copyright Titanium I.T. LLC.
"use strict";

const CommandLine = require("infrastructure/command_line");
const ensure = require("util/ensure");

/** Overall command-line entry point */
exports.run = function({
	commandLine = CommandLine.create(),
} = {}) {
	ensure.signature(arguments, [[ undefined, {
		commandLine: [ undefined, CommandLine ],
	}]]);

	const args = commandLine.args();
	if (args.length !== 2) {
		commandLine.writeStderr("Usage: run PORT TEXT\n");
		return;
	}

	commandLine.writeStdout("TO DO\n");
};