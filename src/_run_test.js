// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./util/assert");
const testHelper = require("./util/test_helper");
const score = require("./logic/score");
const ERROR_CODE = require("./infrastructure/command_line").ERROR_CODE;

describe("Run", function() {

	it("Analyzes hand, writes output, and exits without error", async function() {
		let arg = "JH5D5S5C5H";
		const { code, stdout, stderr } = await runAppAsync([ arg ]);

		assert.equal(stdout, score.analyze(arg) + "\n", "stdout");
		assert.equal(stderr, "", "stderr");
		assert.equal(code, ERROR_CODE.NONE, "error code");
	});

	it("Provides usage and exits with error when no command-line arguments provided", async function() {
		const { code, stderr } = await runAppAsync([]);
		assert.equal(stderr, "Usage: run hand\n", stderr);
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
	return await testHelper.runModuleAsync(__dirname, "./run.js", { args, failOnError: false });
}