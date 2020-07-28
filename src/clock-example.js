// Copyright Titanium I.T. LLC.
"use strict";

const CommandLine = require("./infrastructure/command_line");
const Clock = require("./infrastructure/clock");

exports.go = function(commandLine = CommandLine.create(), clock = Clock.create()) {
	const format = {
		dateStyle: "medium",
		timeStyle: "long",
		hour12: false,
		timeZone: "UTC",
	};
	// const time = clock.toFormattedString(format, "en-US");

	const time = clock.toFormattedString(format, "en-US");
	commandLine.writeStdout(time + "\n");
};
