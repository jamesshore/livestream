// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("util/assert");
const CommandLine = require("infrastructure/command_line");
const Rot13Client = require("./infrastructure/rot13_client");
const cli = require("./rot13_cli");

const VALID_PORT = 5000;
const VALID_TEXT = "my_text";
const VALID_ARGS = [ VALID_PORT.toString(), VALID_TEXT ];

describe("ROT-13 CLI", function() {

	it("calls ROT-13 service", async function() {
		const { rot13Requests, stdout } = await runAsync({
			args: VALID_ARGS,
			rot13Response: "transformed text",
		});

		assert.deepEqual(rot13Requests, [{
			port: VALID_PORT,
			text: VALID_TEXT,
		}]);
		assert.deepEqual(stdout, [ "transformed text\n" ]);
	});

	it("outputs an error when ROT-13 service fails", async function() {
		const { stderr } = await runAsync({
			args: VALID_ARGS,
			rot13Error: "my error",
		});

		assert.equal(stderr[0], "ROT-13 service failed:\n");
		assert.match(stderr[1], /my error/);
	});

	it("writes usage to command-line when arguments not provided", async function() {
		const { stderr } = await runAsync({ args: [] });
		assert.deepEqual(stderr, [ "Usage: run PORT TEXT\n" ]);
	});

});

async function runAsync({ args, rot13Response, rot13Error }) {
	const commandLine = CommandLine.createNull({ args });
	const stdout = commandLine.trackStdout();
	const stderr = commandLine.trackStderr();

	const rot13Client = Rot13Client.createNull([{ response: rot13Response, error: rot13Error }]);
	const rot13Requests = rot13Client.trackRequests();

	await cli.runAsync({ commandLine, rot13Client });

	return { stdout, stderr, rot13Requests };
}