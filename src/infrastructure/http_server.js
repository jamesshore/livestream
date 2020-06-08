// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("../util/ensure");
const http = require("http");
const EventEmitter = require("events");

module.exports = class HttpServer {

	static create() {
		ensure.signature(arguments, []);
		return new HttpServer(http);
	}

	static createNull() {
		ensure.signature(arguments, []);
		return new HttpServer(nullHttp);
	}

	constructor(http) {
		this._http = http;
		this._server = null;
	}

	get isStarted() {
		return this._server !== null;
	}

	startAsync({ port }) {
		return new Promise((resolve, reject) => {
			ensure.signature(arguments, [{ port: Number }]);
			if (this.isStarted) throw new Error("Can't start server because it's already running");

			this._server = this._http.createServer();
			this._server.on("error", (err) => {
				reject(new Error(`Couldn't start server due to error: ${err.message}`));
			});
			this._server.on("listening", resolve);
			this._server.listen(port);
		});
	}

	stopAsync() {
		return new Promise((resolve, reject) => {
			ensure.signature(arguments, []);
			if (!this.isStarted) throw new Error("Can't stop server because it isn't running");

			this._server.on("close", () => {
				this._server = null;
				resolve();
			});
			this._server.close();
		});
	}

};


const nullHttp = {
	createServer() {
		return new NullNodeServer();
	}
};

class NullNodeServer extends EventEmitter {
	listen() {
		setImmediate(() => this.emit("listening"));
	}
	close() {
		setImmediate(() => this.emit("close"));
	}
}