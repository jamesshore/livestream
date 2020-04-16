// Copyright (c) 2016 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
(function() {
	"use strict";

	var runner = require("./index.js");
	var assert = require("./assert.js");
	var stdout = require("test-console").stdout;

	describe("Karma runner", function() {

		var configFile = "./build/karma.conf.js";

		it("runs Karma", function(done) {
			runner.run({
				configFile: configFile
			}, assertSuccess(done), assertNotFailure(done));
		});

		it("writes Karma progress to console", function(done) {
			var inspect = stdout.inspect();
			runner.run({
				configFile: configFile
			}, success, failure);

			function success() {
				inspect.restore();
				var stringOutput = inspect.output.map(function(data) { return data.toString(); }).join("\n");
				assert.matches(stringOutput, /Executed 1 of 1/);
				assertSuccess(done)();
			}

			function failure() {
				inspect.restore();
				assertNotFailure(done)();
			}
		});

		it("checks expected browsers", function(done) {
			runner.run({
				configFile: configFile,
				expectedBrowsers: [ "force-failure browser" ],
				strict: true
			}, assertNotSuccess(done), assertFailure(done, "Karma did not test all browsers"));
		});

		it("warns about expected browsers, rather than fails, when strict mode is off", function(done) {
			runner.run({
				configFile: configFile,
				expectedBrowsers: [ "force-failure browser" ],
				strict: false
			}, assertSuccess(done), assertNotFailure(done));
		});

		it("passes client args through and also fails when no tests are run", function(done) {
			runner.run({
				configFile: configFile,
				clientArgs: ["--grep=NO-SUCH-TEST-NAME:"]
				}, assertNotSuccess(done), assertFailure(done, "No Karma tests were run!"));
		});

		it("automatically captures browsers", function(done) {
			this.timeout(10 * 1000);
			runner.run({
				configFile: configFile,
				capture: [ "Firefox" ]
			}, assertSuccess(done), assertNotFailure(done));
		});

		function assertSuccess(done) {
			return function() {
				done();
			};
		}

		function assertFailure(done, expectedMessage) {
			return function(failureMessage) {
				if (expectedMessage !== undefined) assert.equal(failureMessage, expectedMessage);
				done();
			};
		}

		function assertNotSuccess(done) {
			return function() {
				assert.fail("Success callback called, but expected failure.");
			};
		}

		function assertNotFailure(done) {
			return function(failureMessage) {
				assert.fail("Failure callback called, but expected success. Failure message: [" + failureMessage + "]");
			};
		}

	});

}());