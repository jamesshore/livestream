// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./util/assert");
const td = require("testdouble");
const score = require("./logic/score");
const CommandLine = require("./infrastructure/command_line");
const App = require("./app");

const USAGE = "Usage: node program.js hand\n";

describe("Run", function() {

	it("Analyzes hand, writes output, and exits without error", function() {
		const arg = "JH5D5S5C5H";
		const expectedOutput = score.analyze(arg) + "\n";
		const { commandLine, app } = setup({ args: [ arg ] });

		const exitCode = app.run();

		assertStdout(commandLine, expectedOutput);
		assert.equal(exitCode, 0, "exit code");
	});

	it("Provides usage and exits with error when no command-line arguments provided", function() {
		const { commandLine, app } = setup({
			args: [],
			invokedCommand: "node program.js"
		});

		const exitCode = app.run();

		assertStderr(commandLine, USAGE);
		assert.equal(exitCode, 1, "exit code");
	});

	it("Provides usage and exits with error when too many command-line arguments provided", function() {
		const { commandLine, app } = setup({
			args: [ "too", "many" ],
			invokedCommand: "node program.js"
		});

		const exitCode = app.run();

		assertStderr(commandLine, USAGE);
		assert.equal(exitCode, 1, "exit code");
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

		const { commandLine, app } = setup({ args: [ arg ] });

		const exitCode = app.run();

		assertStderr(commandLine, expectedError);
		assert.equal(exitCode, 1, "exit code");
	});

});

function setup({ args, invokedCommand = "irrelevant_invoked_command" }) {
	const commandLine = new (td.constructor(CommandLine));
	const app = App.create(commandLine);

	td.when(commandLine.args()).thenReturn(args);
	td.when(commandLine.invokedCommand()).thenReturn(invokedCommand);

	return { commandLine, app };
}

function assertStdout(commandLine, expectedOutput) {
	td.verify(commandLine.writeStdout(expectedOutput), "stdout");
}

function assertStderr(commandLine, expectedError) {
	td.verify(commandLine.writeStderr(expectedError), "stderr");
}
