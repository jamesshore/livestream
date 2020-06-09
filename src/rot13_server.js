// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("./util/ensure");
const CommandLine = require("./infrastructure/command_line");
const HttpServer = require("./infrastructure/http_server");

module.exports = class App {

	static create(commandLine = CommandLine.create(), httpServer = HttpServer.create()) {
		return new App(commandLine, httpServer);
	}

	constructor(commandLine, httpServer) {
		ensure.signature(arguments, [ CommandLine, HttpServer ]);
		this._commandLine = commandLine;
		this._httpServer = httpServer;
	}

	async startAsync() {
		ensure.signature(arguments, []);

		const args = this._commandLine.args();
		if (args.length !== 1) {
			this._commandLine.writeStderr(`Usage: run PORT\n`);
			return;
		}

		const port = parseInt(args[0], 10);
		await runServerAsync(this, port);
	}

};


async function runServerAsync(self, port) {
	function onRequestAsync() {
		self._commandLine.writeStdout("Received request\n");
		return {
			status: 501,
			headers: { "Content-Type": "text/plain; charset=utf-8" },
			body: "Not yet implemented",
		};
	}

	await self._httpServer.startAsync({ port, onRequestAsync });
	self._commandLine.writeStdout(`Server started on port ${port}\n`);
}