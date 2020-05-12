// Copyright Titanium I.T. LLC.
"use strict";

const commandLine = require("./infrastructure/command_line");
const rot13 = require("./logic/rot13");

const input = commandLine.args()[0];
const output = rot13.transform(input);
commandLine.writeOutput(output);