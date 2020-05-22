// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./util/assert");
const testHelper = require("./util/test_helper");
const score = require("./logic/score");
const ERROR_CODE = require("./infrastructure/command_line").ERROR_CODE;

describe("Top-level Application Runner", function() {

	it("works end-to-end", async function() {
		let arg = "JH5D5S5C5H";
		const { code, stdout, stderr } = await runAppAsync([ arg ]);

		assert.equal(stdout, score.analyze(arg) + "\n", "stdout");
		assert.equal(stderr, "", "stderr");
		assert.equal(code, ERROR_CODE.NONE, "error code");
	});

});

async function runAppAsync(args) {
	return await testHelper.runModuleAsync(__dirname, "./score.js", { args, failOnError: false });
}