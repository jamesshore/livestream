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
		const clock = Clock.createNull({ now: 0, locale: "uk", timeZone: "America/New_York" });

		countdown.countdownAsync(TEXT, commandLine, clock);

		assert.equal(commandLine.getLastStdout(), "3\n");
		await advanceOneSecondAsync(clock);
		assert.equal(commandLine.getLastStdout(), "2\n");

		let output = [];
		commandLine.onStdout((text) => output.push(text));

		await advanceOneSecondAsync(clock);
		assert.deepEqual(output, [
			"1\n",
			"31 груд. 1969 р., 19:00\n",
		]);
	});

});

async function advanceOneSecondAsync(clock) {
	await clock.advanceNullAsync(1000);
}
