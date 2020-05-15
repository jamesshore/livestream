// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("../util/assert");
const testHelper = require("../util/test_helper");
const commandLine = require("./command_line");

describe("CommandLine", function() {

	it("provides command-line arguments", async function() {
		const args = [ "my arg 1", "my arg 2" ];
		const { stdout } = await runModuleAsync("./_command_line_test_args_runner.js", { args });
		assert.equal(stdout, '["my arg 1","my arg 2"]');
	});

	it("writes output", async function() {
		const { stdout, stderr } = await runModuleAsync("./_command_line_test_output_runner.js");
		assert.equal(stdout, "my output", "stdout");
		assert.equal(stderr, "", "stderr");
	});

	it("writes error output", async function() {
		const { stdout, stderr } = await runModuleAsync("./_command_line_test_output_error_runner.js", { failOnError: false });
		assert.equal(stderr, "my error output", "stderr");
		assert.equal(stdout, "", "stdout");
	});

	it("exits with no error", async function() {
		const { code } = await runModuleAsync("./_command_line_test_exit_without_error_runner.js");
		assert.equal(code, 0);
	});

	it("exits with 'bad command line' error", async function() {
		const { code } = await runModuleAsync("./command_line_test_exit_with_command_line_error_runner.js");
		assert.equal(code, 1);
	});

});

async function runModuleAsync(relativeModulePath, options) {
	return await testHelper.runModuleAsync(__dirname, relativeModulePath, options);
}
