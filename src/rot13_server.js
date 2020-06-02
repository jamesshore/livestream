// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("./util/ensure");
const CommandLine = require("./infrastructure/command_line");

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
			return;
		}

		const port = args[0];
		await runServerAsync(this, port);
	}

};


async function runServerAsync(self, port) {
	// await self._httpServer.startAsync(port);
	// self._commandLine.writeStdout(`Server started on port ${port}\n`);
}