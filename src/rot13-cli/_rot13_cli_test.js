// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("util/assert");
const CommandLine = require("infrastructure/command_line");
const cli = require("./rot13_cli");

describe("ROT-13 CLI", function() {

	it("isn't implemented", function() {
		const { stdout } = run({ args: [ "5000", "my_text" ]});
		assert.deepEqual(stdout, [ "TO DO\n" ]);
	});

	it("writes usage to command-line when arguments not provided", function() {
		const { stderr } = run({ args: [] });
		assert.deepEqual(stderr, [ "Usage: run PORT TEXT\n" ]);
	});

});

function run({ args }) {
	const commandLine = CommandLine.createNull({ args });
	const stdout = commandLine.trackStdout();
	const stderr = commandLine.trackStderr();

	cli.run({ commandLine });

	return { stdout, stderr };
}