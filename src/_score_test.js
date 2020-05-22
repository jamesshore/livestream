// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./util/assert");
const testHelper = require("./util/test_helper");
const score = require("./logic/score");

describe("Top-level Application Runner", function() {

	it("works end-to-end and exits with error code", async function() {
		const { code, stdout, stderr } = await runAppAsync([]);

		assert.match(stderr, /^Usage:/, "stdout");
		assert.equal(code, 1, "error code");
	});

});

async function runAppAsync(args) {
	return await testHelper.runModuleAsync(__dirname, "./score.js", { args, failOnError: false });
}