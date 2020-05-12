// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("../assert");
const commandLine = require("./command_line");
const childProcess = require("child_process");
const path = require("path");

describe("CommandLine", function() {

	it("provides command-line arguments", async function() {
		const args = [ "my arg 1", "my arg 2" ];
		const stdout = await runModule("./_command_line_test_args_runner.js", args);
		assert.equal(stdout, '["my arg 1","my arg 2"]');
	});

	it("writes output", async function() {
		const stdout = await runModule("./_command_line_test_output_runner.js");
		assert.equal(stdout, "my output\n");
	});

});

function runModule(relativeModulePath, args) {
	return new Promise((resolve, reject) => {
		const absolutePath = path.resolve(__dirname, relativeModulePath);
		const options = {
			stdio: "pipe",
		};
		const child = childProcess.fork(absolutePath, args, options);

		let stdout = "";
		let stderr = "";
		child.stdout.on("data", (data) => {
			stdout += data;
		});
		child.stderr.on("data", (data) => {
			stderr += data;
		});

		child.on("exit", () => {
			if (stderr !== "") {
				console.log(stderr);
				return reject(new Error("Runner failed"));
			}
			else {
				return resolve(stdout);
			}
		});
	});
}
