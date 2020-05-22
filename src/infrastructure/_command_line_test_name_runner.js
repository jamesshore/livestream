// Copyright Titanium I.T. LLC.
"use strict";

const commandLine = require("./command_line").create();

process.stdout.write(commandLine.invokedCommand());