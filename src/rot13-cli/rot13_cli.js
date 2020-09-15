// Copyright Titanium I.T. LLC.
"use strict";

const CommandLine = require("infrastructure/command_line");
const ensure = require("util/ensure");
const Rot13Client = require("./infrastructure/rot13_client");
const Clock = require("infrastructure/clock");

const TIMEOUT_IN_MS = 5000;

/** Overall command-line entry point */
exports.runAsync = async function({
	commandLine = CommandLine.create(),
	rot13Client = Rot13Client.create(),
	clock = Clock.create(),
} = {}) {
	ensure.signature(arguments, [[ undefined, {
		commandLine: [ undefined, CommandLine ],
		rot13Client: [ undefined, Rot13Client ],
		clock: [ undefined, Clock ],
	}]]);

	const args = commandLine.args();
	if (args.length !== 2) {
		commandLine.writeStderr("Usage: run PORT TEXT\n");
		return;
	}

	const port = parseInt(args[0], 10);
	const text = args[1];

	try {
		const response = await Promise.race([
			rot13Client.transformAsync(port, text),
			timeoutAsync(clock),
		]);
		commandLine.writeStdout(response + "\n");
	}
	catch (err) {
		commandLine.writeStderr("ROT-13 service failed:\n");
		commandLine.writeStderr(err.message + "\n");
	}
};

async function timeoutAsync(clock) {
	await clock.waitAsync(TIMEOUT_IN_MS);
	throw new Error("Service timed out.");
}