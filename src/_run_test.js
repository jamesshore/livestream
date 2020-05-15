// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./util/assert");
const testHelper = require("./util/test_helper");
const score = require("./logic/score");

describe("Run", function() {

	it("Analyzes hand, writes output, and exits without error", async function() {
		let arg = "JH5D5S5C5H";
		const { code, stdout, stderr } = await runAppAsync([ arg ]);

		assert.equal(stdout, score.analyze(arg) + "\n", "stdout");
		assert.equal(stderr, "", "stderr");
		assert.equal(code, 0, "error code");
	});

	it("Exits with error when no parameters provided (or other error occurs", async function() {
		let expectedError;
		try {
			score.analyze();
		}
		catch (err) {
			expectedError = err.message + "\n";
		}

		const { code, stdout, stderr } = await runAppAsync([]);

		assert.equal(stdout, "", "stdout");
		assert.equal(stderr, expectedError, "stderr");
		assert.equal(code, 1, "error code");
	});

});

async function runAppAsync(args) {
	return await testHelper.runModuleAsync(__dirname, "./run.js", { args, failOnError: false });
}