// Copyright Titanium I.T. LLC.
"use strict";

const CommandLine = require("./command_line.js");

const commandLine = CommandLine.createNull();

commandLine.writeOutput("stdout should not be output");
commandLine.writeError("stderr should not be output");