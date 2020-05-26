// Copyright Titanium I.T. LLC.
"use strict";

const td = require("testdouble");
const assert = require("./util/assert");
const CommandLine = require("./infrastructure/command_line");
const rot13 = require("./logic/rot13");
const App = require("./app");

describe("App", function() {

	it("reads command-line argument, transform it with ROT-13, and write result", function() {
		const input = "my input";
		const expectedOutput = rot13.transform(input);

		const commandLine = new (td.constructor(CommandLine));
		const app = App.create(commandLine);

		td.when(commandLine.args()).thenReturn([ input ]);

		app.run();
		td.verify(commandLine.writeOutput(expectedOutput));
	});

	it("writes usage to command-line when no argument provided", function() {
		const commandLine = new (td.constructor(CommandLine));
		const app = App.create(commandLine);

		td.when(commandLine.args()).thenReturn([]);

		app.run();
		td.verify(commandLine.writeOutput("Usage: run text_to_transform"));
	});

	it("complains when too many command-line arguments provided", function() {
		const commandLine = new (td.constructor(CommandLine));
		const app = App.create(commandLine);

		td.when(commandLine.args()).thenReturn([ "a", "b" ]);

		app.run();
		td.verify(commandLine.writeOutput("too many arguments"));
	});

});

