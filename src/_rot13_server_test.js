// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./util/assert");
const CommandLine = require("./infrastructure/command_line");
const Server = require("./rot13_server");

const USAGE = "Usage: run PORT\n";

describe("ROT-13 Server", function() {

	describe("Command-line processing", function() {

		it("Provides usage and exits with error when no command-line arguments provided", async function() {
			const { commandLine } = await startServerAsync({ args: [] });
			assert.deepEqual(commandLine.getLastStderr(), USAGE);
		});

		it("Provides usage and exits with error when too many command-line arguments provided", async function() {
			const { commandLine } = await startServerAsync({ args: ["too", "many"] });
			assert.deepEqual(commandLine.getLastStderr(), USAGE);
		});

	});

});

async function startServerAsync({ args = [ "4242" ] } = {}) {
	const commandLine = CommandLine.createNull({ args  });
	const app = Server.create(commandLine);

	await app.startAsync();

	return {
		commandLine,
	};
}
