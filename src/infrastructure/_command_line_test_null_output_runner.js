// Copyright Titanium I.T. LLC.
"use strict";

const CommandLine = require("./command_line");

CommandLine.createNull().writeStdout("this output should never be seen");