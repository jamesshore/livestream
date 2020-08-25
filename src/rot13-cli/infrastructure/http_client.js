// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("util/ensure");
const http = require("http");
const EventEmitter = require("events");
const infrastructureHelper = require("util/infrastructure_helper");

const REQUEST_EVENT = "request";

/** Generic HTTP client */
module.exports = class HttpClient {

	static create() {
		return new HttpClient(http);
	}

	static createNull(responses) {
		return new HttpClient(new NullHttp(responses));
	}

	constructor(http) {
		this._http = http;
		this._emitter = new EventEmitter();
	}

	async requestAsync({ host, port, method, path, headers = {}, body = "" }) {
		ensure.signature(arguments, [{
			host: String,
			port: Number,
			method: String,
			path: String,
			headers: [ undefined, Object ],
			body: [ undefined, String ],
		}]);

		return await new Promise((resolve, reject) => {
			const request = this._http.request({ host, port, method, path, headers });
			this._emitter.emit(REQUEST_EVENT, {
				host, port, method: method.toLowerCase(), path, headers: normalizeHeaders(headers), body
			});

			request.on("response", (response) => {
				const headers = { ...response.headers };
				delete headers.connection;
				delete headers["content-length"];
				delete headers.date;

				let body = "";
				response.on("data", (chunk) => {
					body += chunk;
				});
				response.on("end", () => {
					resolve({
						status: response.statusCode,
						headers,
						body,
					});
				});
			});

			request.end(body);
		});
	}

	trackRequests() {
		return infrastructureHelper.trackOutput(this._emitter, REQUEST_EVENT);
	}

};

function normalizeHeaders(headers) {
	const normalized = Object.entries(headers).map(([ key, value ]) => [ key.toLowerCase(), value ]);
	return Object.fromEntries(normalized);
}


class NullHttp {

	constructor(responses = {}) {
		this._responses = responses;
	}

	request({ path }) {
		return new NullRequest(this._responses[path]);
	}

}

class NullRequest extends EventEmitter {

	constructor(endpointResponses = []) {
		super();
		this._endpointResponses = endpointResponses;
	}

	end() {
		setImmediate(() => {
			this.emit("response", new NullResponse(this._endpointResponses.shift()));
		});
	}

}

class NullResponse extends EventEmitter {

	constructor({ status, headers = {}, body = ""} = {
		status: 503,
		headers: { NullHttpClient: "default header" },
		body: "Null HttpClient default response",
	}) {
		super();
		this._status = status;
		this._headers = normalizeHeaders(headers);

		setImmediate(() => {
			this.emit("data", body);
			this.emit("end");
		});
	}

	get statusCode() {
		return this._status;
	}

	get headers() {
		return this._headers;
	}

}