// Copyright Titanium I.T. LLC.
"use strict";

const CommandLine = require("./command_line.js");

const commandLine = CommandLine.createNull();

commandLine.writeStdout("stdout should not be output");
commandLine.writeStderr("stderr should not be output");