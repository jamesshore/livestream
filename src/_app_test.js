// Copyright Titanium I.T. LLC.
"use strict";

const sinon = require("sinon");
const CommandLine = require("./infrastructure/command_line");
const Rot13 = require("./logic/rot13");
const App = require("./app");

describe("App", function() {

	afterEach(function() {
		sinon.reset();
	});

	it("read command-line argument, transform it with ROT-13, and write result", function() {
		const commandLineMock = sinon.mock(CommandLine.create());
		const rot13Mock = sinon.mock(Rot13.create());
		const app = App.create(commandLineMock.object, rot13Mock.object);

		commandLineMock.expects("args").returns([ "my input" ]);
		rot13Mock.expects("transform").withExactArgs("my input").returns("my output");
		commandLineMock.expects("writeOutput").withExactArgs("my output");

		app.run();

		commandLineMock.verify();
	});

	it("writes usage to command-line when no argument provided", function() {
		const commandLineMock = sinon.mock(CommandLine.create());
		const rot13Mock = sinon.mock(Rot13.create());
		const app = App.create(commandLineMock.object, rot13Mock.object);

		commandLineMock.expects("args").returns([]);
		rot13Mock.expects("transform").never();
		commandLineMock.expects("writeOutput").withExactArgs("Usage: run text_to_transform");

		app.run();

		commandLineMock.verify();
	});

	it("complains when too many command-line arguments provided", function() {
		const commandLineMock = sinon.mock(CommandLine.create());
		const rot13Mock = sinon.mock(Rot13.create());
		const app = App.create(commandLineMock.object, rot13Mock.object);

		commandLineMock.expects("args").returns([ "a", "b" ]);
		rot13Mock.expects("transform").never();
		commandLineMock.expects("writeOutput").withExactArgs("too many arguments");

		app.run();

		commandLineMock.verify();
	});

});