// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./util/assert");
const td = require("testdouble");
const testHelper = require("./util/test_helper");
const score = require("./logic/score");
const CommandLine = require("./infrastructure/command_line");
const App = require("./app");
const ERROR_CODE = require("./infrastructure/command_line").ERROR_CODE;

describe("Run", function() {

	it("Analyzes hand, writes output, and exits without error", function() {
		const commandLine = td.object(CommandLine.create());
		const app = App.create(commandLine);

		const arg = "JH5D5S5C5H";
		td.when(commandLine.args()).thenReturn([ arg ]);

		app.run();

		const expectedOutput = score.analyze(arg) + "\n";
		td.verify(commandLine.writeOutput(expectedOutput));
		td.verify(commandLine.exitWithoutError());
	});

	it("Provides usage and exits with error when no command-line arguments provided", async function() {
		const { code, stderr } = await runAppAsync([]);
		assert.equal(stderr, "Usage: node score.js hand\n", "stderr");
		assert.equal(code, ERROR_CODE.BAD_COMMAND_LINE, "error code");
	});

	it("Exits with error when bad hand provided", async function() {
		const arg = "BAD_HAND";

		let expectedError;
		try {
			score.analyze(arg);
		}
		catch (err) {
			expectedError = err.message + "\n";
		}

		const { code, stdout, stderr } = await runAppAsync([ arg ]);

		assert.equal(stdout, "", "stdout");
		assert.equal(stderr, expectedError, "stderr");
		assert.equal(code, ERROR_CODE.BAD_COMMAND_LINE, "error code");
	});

});

async function runAppAsync(args) {
	return await testHelper.runModuleAsync(__dirname, "./score.js", { args, failOnError: false });
}