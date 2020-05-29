// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("../util/assert");
const testHelper = require("../util/test_helper");
const CommandLine = require("./command_line");

describe("CommandLine", function() {

	it("provides command-line arguments", async function() {
		const args = [ "my arg 1", "my arg 2" ];
		const { stdout } = await runModuleAsync("./_command_line_test_args_runner.js", { args });
		assert.equal(stdout, '["my arg 1","my arg 2"]');
	});

	it("provides name used to run program", async function() {
		const { stdout } = await runModuleAsync("./_command_line_test_name_runner.js");
		assert.equal(stdout, "node _command_line_test_name_runner.js");
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


	describe("Nullability", function() {

		it("args defaults to empty", function() {
			const commandLine = CommandLine.createNull();
			assert.deepEqual(commandLine.args(), []);
		});

		it("args can be configured", function() {
			const commandLine = CommandLine.createNull({ args: [ "one", "two" ]});
			assert.deepEqual(commandLine.args(), [ "one", "two" ]);
		});

		it("invoked command has a default", function() {
			const commandLine = CommandLine.createNull();
			assert.equal(commandLine.invokedCommand(), "null_process_node null_process_script.js");
		});

		it("invoked command can be configured", function() {
			const commandLine = CommandLine.createNull({ invokedCommand: "my_node my_script" });
			assert.equal(commandLine.invokedCommand(), "my_node my_script");
		});

		it("fails fast if wrong number of words is provided", function() {
			assertFailure("word1");
			assertFailure("word1 word2 word3");

			function assertFailure(invokedCommand) {
				assert.throws(
					() => CommandLine.createNull({ invokedCommand }),
					`invokedCommand has wrong number of words; must be two, but was: "${invokedCommand}"`
				);
			}
		});

		it("does not write output to stdout", async function() {
			const { stdout, stderr } = await runModuleAsync(
				"./_command_line_test_null_output_runner.js", { failOnError: false   }
			);
			assert.equal(stdout, "", "stdout");
			assert.equal(stderr, "", "stderr");
		});

	});

});

async function runModuleAsync(relativeModulePath, options) {
	return await testHelper.runModuleAsync(__dirname, relativeModulePath, options);
}
