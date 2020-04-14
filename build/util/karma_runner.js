// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
"use strict";

const path = require("path");
const sh = require("./sh.js");
const runner = require("karma/lib/runner");

const KARMA = "node node_modules/karma/bin/karma";
const KARMA_START = KARMA + " start build/config/karma.conf.js";
const CONFIG = { configFile: path.resolve("build/config/karma.conf.js") };

exports.serve = function(success, fail) {
	sh.run(KARMA_START, success, function() {
		fail("Could not start Karma server");
	});
};

exports.runTests = function(requiredBrowsers, success, fail) {
	const stdout = new CapturedStdout();

	runner.run(CONFIG, function(exitCode) {
		stdout.restore();

		if (exitCode) fail("Client tests failed (to start server, run 'jake karma')");
		const browserMissing = checkRequiredBrowsers(requiredBrowsers, stdout);
		if (browserMissing && !process.env.loose) fail("Did not test all supported browsers (use 'loose=true' to suppress error)");
		if (stdout.capturedOutput.indexOf("TOTAL: 0 SUCCESS") !== -1) fail("No tests were run!");

		success();
	});
};

function checkRequiredBrowsers(requiredBrowsers, stdout) {
	let browserMissing = false;
	requiredBrowsers.forEach(function(browser) {
		browserMissing = lookForBrowser(browser, stdout.capturedOutput) || browserMissing;
	});
	return browserMissing;
}

function lookForBrowser(browser, output) {
	const missing = output.indexOf(browser + ": Executed") === -1;
	if (missing) console.log(browser + " was not tested!");
	return missing;
}

function CapturedStdout() {
	const self = this;
	self.oldStdout = process.stdout.write;
	self.capturedOutput = "";

	process.stdout.write = function(data) {
		self.capturedOutput += data;
		self.oldStdout.apply(this, arguments);
	};
}

CapturedStdout.prototype.restore = function() {
	process.stdout.write = this.oldStdout;
};
