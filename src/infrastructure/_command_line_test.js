// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("../util/assert");
const childProcess = require("child_process");
const path = require("path");
const CommandLine = require("./command_line");

describe("CommandLine", function() {

	it("provides command-line arguments", async function() {
		const args = [ "my arg 1", "my arg 2" ];
		const { stdout } = await runModuleAsync("./_command_line_test_args_runner.js", { args });
		assert.equal(stdout, '["my arg 1","my arg 2"]');
	});

	it("writes to stdout and stderr", async function() {
		const { stdout } = await runModuleAsync("./_command_line_test_output_runner.js");
		assert.equal(stdout, "my stdout", "stdout");
	});

	it("remembers last write to stdout", function() {
		const commandLine = CommandLine.createNull();
		commandLine.writeStdout("my last stdout");
		assert.equal(commandLine.getLastStdout(), "my last stdout");
	});

	it("last output is null when nothing has been output yet", function() {
		const commandLine = CommandLine.createNull();
		assert.equal(commandLine.getLastStdout(), null);
	});

	it("tracks writes to stdout", function() {
		const commandLine = CommandLine.createNull();

		const output = commandLine.trackStdout();
		commandLine.writeStdout("A");
		assert.deepEqual(output, [ "A" ]);

		output.off();
		commandLine.writeStdout("B");
		assert.deepEqual(output, []);
	});

	it("stdout tracker allows output to be consumed", function() {
		const commandLine = CommandLine.createNull();
		const output = commandLine.trackStdout();

		commandLine.writeStdout("A");
		assert.deepEqual(output.consume(), [ "A" ]);

		commandLine.writeStdout("B");
		assert.deepEqual(output.consume(), [ "B" ]);
	});

	it("emits an event when output occurs", function() {
		const commandLine = CommandLine.createNull();

		let lastStdout = "none";
		const off = commandLine.onStdout((text) => {
			lastStdout = text;
		});

		commandLine.writeStdout("A");
		assert.equal(lastStdout, "A");

		off();
		commandLine.writeStdout("B");
		assert.equal(lastStdout, "A");
	});

	it.skip("TEMP: demonstrate memory leak", async function() {
		this.timeout(25000);

		const commandLine = CommandLine.createNull();
		await checkForLeakAsync(256, 20, () => {
			const output = commandLine.trackStdout();
			for (let i = 0; i < 50; i++) {
				const tenMiB = Buffer.alloc(10 * 1024 * 1024, Math.random());
				commandLine.writeStdout(tenMiB);
			}
			output.off();
		});
	});


	describe("Nullability", function() {

		it("defaults to no arguments", function() {
			const commandLine = CommandLine.createNull();
			assert.deepEqual(commandLine.args(), []);
		});

		it("allows arguments to be configured", function() {
			const commandLine = CommandLine.createNull({ args: [ "one", "two" ]});
			assert.deepEqual(commandLine.args(), [ "one", "two" ]);
		});

		it("doesn't write output to command line", async function() {
			const { stdout } = await runModuleAsync("./_command_line_test_null_output_runner.js");
			assert.equal(stdout, "", "stdout");
		});

	});

});


async function checkForLeakAsync(minLeakSizeInMiB, secondsToWait, fn) {
	const before = usage();
	logUsage("BEFORE");
	fn();
	logUsage("AFTER");

	const start = Date.now();
	await new Promise((resolve) => {
		const handle = setInterval(() => {
			logUsage("WAITING");
			const leaked = usage() - before;
			if (Date.now() - start > 1000 * secondsToWait || leaked <= minLeakSizeInMiB) {
				clearInterval(handle);
				if (leaked > minLeakSizeInMiB) throw new Error("Memory leak!");
				resolve();
			}
		}, 500);
	});

	function logUsage(name) {
		console.log(name, usage().toFixed(1) + "MiB");
	}

	function usage() {
		return process.memoryUsage().rss / 1024 / 1024;
	}
}

function runModuleAsync(relativeModulePath, { args, failOnStderr } = {}) {
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
			if (failOnStderr && stderr !== "") {
				console.log(stderr);
				return reject(new Error("Runner failed"));
			}
			else {
				return resolve({ stdout, stderr });
			}
		});
	});
}
