// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./util/assert");
const score = require("./logic/score");
const CommandLine = require("./infrastructure/command_line");
const App = require("./app");

const USAGE = "Usage: node program.js hand\n";

describe("Run", function() {

	it("Analyzes hand, writes output, and exits without error", function() {
		const input = "JH5D5S5C5H";
		const expectedOutput = score.analyze(input) + "\n";

		const { exitCode, stdout } = runApp({ args: [ input ] });
		assert.equal(exitCode, 0, "exit code");
		assert.deepEqual(stdout, [ expectedOutput ]);
	});

	it("Provides usage and exits with error when no command-line arguments provided", function() {
		const { exitCode, stderr } = runApp({
			args: [],
			invokedCommand: "node program.js"
		});

		assert.equal(exitCode, 1, "exit code");
		assert.deepEqual(stderr, [ USAGE ]);
	});

	it("Provides usage and exits with error when too many command-line arguments provided", function() {
		const { exitCode, stderr } = runApp({
			args: [ "too", "many" ],
			invokedCommand: "node program.js"
		});

		assert.equal(exitCode, 1, "exit code");
		assert.deepEqual(stderr, [ USAGE ]);
	});

	it("Exits with error when bad hand provided", function() {
		const arg = "BAD_HAND";
		let expectedError;
		try {
			score.analyze(arg);
		}
		catch (err) {
			expectedError = err.message + "\n";
		}

		const { exitCode, stderr } = runApp({ args: [ arg ] });
		assert.equal(exitCode, 1, "exit code");
		assert.deepEqual(stderr, [ expectedError ]);
	});

});

function runApp({ args, invokedCommand }) {
	const commandLine = CommandLine.createNull({ args, invokedCommand });
	const app = App.create(commandLine);
	const stdout = commandLine.trackStdout();
	const stderr = commandLine.trackStderr();

	const exitCode = app.run();
	return { exitCode, stdout, stderr };
}
