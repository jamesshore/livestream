// Copyright Titanium I.T. LLC.
"use strict";

const CommandLine = require("./infrastructure/command_line");

exports.countdownAsync = function(text, commandLine = CommandLine.create()) {
	commandLine.writeStdout("TO DO\n");
};
