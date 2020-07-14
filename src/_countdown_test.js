// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./util/assert");
const countdown = require("./countdown");
const CommandLine = require("./infrastructure/command_line");
const Clock = require("./infrastructure/clock");

describe("Countdown App", function() {

	it("writes one line at a time, waiting one second after each line", async function() {
		const TEXT = [ "3", "2", "1" ];
		const commandLine = CommandLine.createNull();
		const clock = Clock.createNull();

		countdown.countdownAsync(TEXT, commandLine, clock);

		assert.equal(commandLine.getLastStdout(), "3\n");
		await advanceOneSecondAsync(clock);
		assert.equal(commandLine.getLastStdout(), "2\n");
		await advanceOneSecondAsync(clock);
		assert.equal(commandLine.getLastStdout(), "1\n");
	});

});

async function advanceOneSecondAsync(clock) {
	await clock.advanceNullAsync(1000);
}
