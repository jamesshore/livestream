// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("util/assert");
const CommandLine = require("infrastructure/command_line");
const Rot13Client = require("./infrastructure/rot13_client");
const cli = require("./rot13_cli");

describe("ROT-13 CLI", function() {

	it("calls ROT-13 service", async function() {
		const { stdout } = await runAsync({ args: ["hello"] });
		assert.deepEqual(stdout, [ "uryyb\n" ]);
	});

	it("writes usage to command-line when arguments not provided", async function() {
		const { stderr } = await runAsync({ args: [] });
		assert.deepEqual(stderr, [ "Usage: run TEXT\n" ]);
	});

});

async function runAsync({ args }) {
	const commandLine = CommandLine.createNull({ args });
	const stdout = commandLine.trackStdout();
	const stderr = commandLine.trackStderr();

	const rot13Client = Rot13Client.create();

	await cli.runAsync({ commandLine, rot13Client});

	return { stdout, stderr };
}