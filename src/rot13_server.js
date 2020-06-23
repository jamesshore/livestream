// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("./util/ensure");
const CommandLine = require("./infrastructure/command_line");
const HttpServer = require("./infrastructure/http_server");
const rot13 = require("./logic/rot13");
const rot13Response = require("./routing/rot13_response");
const rot13Router = require("./routing/rot13_router");

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
		await this._httpServer.startAsync({ port, onRequestAsync: onRequestAsync.bind(null, this) });
		await this._commandLine.writeStdout(`Server started on port ${port}\n`);
	}

};

async function onRequestAsync(self, request) {
	self._commandLine.writeStdout("Received request\n");
	return await rot13Router.routeAsync(request);
}
