// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("./util/ensure");
const CommandLine = require("./infrastructure/command_line");

const EXIT_CODE = {
	OK: 0,
	BAD_COMMAND_LINE: 1,
};

module.exports = class App {

	static create(commandLine = CommandLine.create()) {
		return new App(commandLine);
	}

	constructor(commandLine) {
		ensure.signature(arguments, [ CommandLine ]);
		this._commandLine = commandLine;
	}

	async startAsync() {
		ensure.signature(arguments, []);

		const args = this._commandLine.args();
		if (args.length !== 1) {
			this._commandLine.writeStderr(`Usage: run PORT\n`);
			return EXIT_CODE.BAD_COMMAND_LINE;
		}

		const port = args[0];
		await runServerAsync(port);
	}

};


function runServerAsync(port) {
	console.log("TO DO");
}