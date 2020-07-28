// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./util/assert");
const example = require("./clock-example");
const CommandLine = require("./infrastructure/command_line");
const Clock = require("./infrastructure/clock");

describe("Clock example", function() {

	it("writes current time", function() {
		const commandLine = CommandLine.createNull();
		const clock = Clock.createNull({ now: 46800000 });

		example.go(commandLine, clock);

		assert.equal(commandLine.getLastStdout(), "Jan 1, 1970, 13:00:00 UTC\n");
	});

});