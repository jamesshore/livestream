// Copyright Titanium I.T. LLC.
"use strict";

const CommandLine = require("./infrastructure/command_line");
const Clock = require("./infrastructure/clock");

const ONE_SECOND = 1000;

exports.countdownAsync = async function(text, commandLine = CommandLine.create(), clock = Clock.create()) {
	for (let i = 0; i < text.length; i++) {
		commandLine.writeStdout(text[i] + "\n");
		await clock.waitAsync(ONE_SECOND);
	}

	const format = { dateStyle: "medium", timeStyle: "short", timeZone: "local" };
	const time = clock.toFormattedString(format, "local");
	commandLine.writeStdout(time + "\n");
};
