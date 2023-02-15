// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./util/assert");
const CommandLine = require("./infrastructure/command_line");
const App = require("./app");
const td = require("testdouble");
const sinon = require("sinon");
const childProcess = require("child_process");
const path = require("path");

describe.only("Comparison between test types for 'Usage' test case", function() {
	this.timeout(10000);

	/* NULLABLE INFRASTRUCTURE
	 * speed: 0.00093ms (1,075,268 tests / sec)
	 * error message:
	 *   AssertionError: expected 'xxx' to equal 'Usage: run text_to_transform\n'
	 *   + expected - actual
	 *
	 *   -xxx
	 *   +Usage: run text_to_transform
	 */

	it("NULLABLE INFRASTRUCTURE - writes usage to command-line when no argument provided", time("nullable", 1000000, function() {
		const commandLine = CommandLine.createNull({ args: [] });
		const app = App.create(commandLine);

		app.run();
		assert.equal(commandLine.getLastOutput(), "Usage: run text_to_transform\n");
	}));


	/* TESTDOUBLE.JS
	 * speed: 0.082ms (12,210 tests / sec)
	 * error message:
	 *   Error: Unsatisfied verification on test double `CommandLine.prototype.writeOutput`.
	 *
	 *     Wanted:
	 *       - called with `("""
	 *   Usage: run text_to_transform
	 *
	 *   """)`.
	 *
	 *     All calls of the test double, in order were:
	 *       - called with `("xxx")`.
	 */

	it("SPIES (testdouble.js) - writes usage to command-line when no argument provided", time("td", 10000, function() {
		td.reset();
		const commandLine = new (td.constructor(CommandLine));
		const app = App.create(commandLine);

		td.when(commandLine.args()).thenReturn([]);

		app.run();
		td.verify(commandLine.writeOutput("Usage: run text_to_transform\n"));
	}));


	/* SINON
	 * speed: 0.36ms (2,793 tests / sec)
	 * error message:
	 *       ExpectationError: Unexpected call: writeOutput(xxx)
	 *	    Expected writeOutput(Usage: run text_to_transform
	 *	) once (never called)
	 */

	it("MOCKS (sinon) - writes usage to command-line when no argument provided", time("sinon", 1000, function() {
		sinon.reset();
		const commandLineMock = sinon.mock(CommandLine.create());
		const app = App.create(commandLineMock.object);

		commandLineMock.expects("args").returns([]);
		commandLineMock.expects("writeOutput").withExactArgs("Usage: run text_to_transform\n");

		app.run();
		commandLineMock.verify();
	}));


	/* END-TO-END INTEGRATION TEST
	 * speed: 44.49ms (22.5 tests / sec)
	 * error message:
	 *  AssertionError: expected 'xxx' to equal 'Usage: run text_to_transform\n'
	 *  + expected - actual
	 *
	 *  -xxx
	 *  +Usage: run text_to_transform
	 */

	it("E2E INTEGRATION - writes usage to command-line when no argument provided", time("e2e", 100, async function() {
		const stdout = await runModuleAsync("./run.js", []);
		assert.equal(stdout, "Usage: run text_to_transform\n");

		function runModuleAsync(relativeModulePath, args) {
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

	}));


});



function time(name, reps, fn) {
	return async function() {
		const start = Date.now();
		for (let i = 0; i < reps; i++) {
			await fn();
		}
		const elapsed = Date.now() - start;
		const msEach = elapsed / reps;
		const perSec = 1000 / msEach;
		console.log(`${name}: ${elapsed}ms elapsed; ${msEach}ms each; ${perSec.toFixed(0)} tests / sec`);
	};
}