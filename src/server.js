// Copyright Titanium I.T. LLC.
"use strict";

const CommandLine = require("./infrastructure/command_line");

const EXIT_CODE = {
	OK: 0,
	BAD_COMMAND_LINE: 1,
};

module.exports = class App {

	static create(commandLine) {
		return new App(commandLine);
	}

	constructor(commandLine) {
		this._commandLine = commandLine;
	}

	async startAsync() {
		const args = this._commandLine.args();
		if (args.length !== 1) {
			this._commandLine.writeStderr(`Usage: serve PORT\n`);
			return EXIT_CODE.BAD_COMMAND_LINE;
		}

		const port = args[0];
		await runServerAsync(port);
	}

};


function runServerAsync(port) {
	// TODO
}