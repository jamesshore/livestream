// Copyright Titanium I.T. LLC.
"use strict";

const CommandLine = require("infrastructure/command_line");
const ensure = require("util/ensure");
const Rot13Client = require("./infrastructure/rot13_client");

/** Overall command-line entry point */
exports.runAsync = async function({
	commandLine = CommandLine.create(),
	rot13Client = Rot13Client.create(),
} = {}) {
	ensure.signature(arguments, [[ undefined, {
		commandLine: [ undefined, CommandLine ],
		rot13Client: [ undefined, Rot13Client ],
	}]]);

	const args = commandLine.args();
	if (args.length !== 1) {
		commandLine.writeStderr("Usage: run TEXT\n");
		return;
	}
	const text = args[0];

	const transformPromise = rot13Client.transformAsync(text);
	const response = await transformPromise;
	commandLine.writeStdout(response + "\n");
};