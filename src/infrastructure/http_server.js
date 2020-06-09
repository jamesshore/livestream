// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("../util/ensure");
const type = require("../util/type");
const http = require("http");
const EventEmitter = require("events");

const RESPONSE_TYPE = { status: Number, headers: Object, body: String };

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

	startAsync({ port, onRequestAsync }) {
		return new Promise((resolve, reject) => {
			ensure.signature(arguments, [{ port: Number, onRequestAsync: Function }]);
			if (this.isStarted) throw new Error("Can't start server because it's already running");

			this._server = this._http.createServer();
			this._server.on("error", (err) => {
				reject(new Error(`Couldn't start server due to error: ${err.message}`));
			});
			this._server.on("request", async (nodeRequest, nodeResponse) => {
				const { status, headers, body } = await handleRequestAsync(onRequestAsync);

				nodeResponse.statusCode = status;
				Object.entries(headers).forEach(([ name, value ]) => nodeResponse.setHeader(name, value));
				nodeResponse.end(body);
			});

			this._server.on("listening", () => {
				resolve();
			});
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

async function handleRequestAsync(onRequestAsync) {
	try {
		const response = await onRequestAsync();
		const typeError = type.check(response, RESPONSE_TYPE);
		if (typeError !== null) {
			return internalServerError("request handler returned invalid response");
		}
		else {
			return response;
		}
	}
	catch (err) {
		return internalServerError("request handler threw exception");
	}
}

function internalServerError(message) {
	return {
		status: 500,
		headers: { "content-type": "text/plain; charset=utf-8" },
		body: "Internal Server Error: " + message,
	};
}


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