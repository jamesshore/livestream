// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("util/ensure");
const type = require("util/type");
const HttpClient = require("./http_client");
const infrastructureHelper = require("util/infrastructure_helper");
const EventEmitter = require("events");

const HOST = "localhost";
const RESPONSE_TYPE = { transformed: String };
const REQUEST_EVENT = "request";

/** ROT-13 service client */
module.exports = class Rot13Client {

	static create() {
		ensure.signature(arguments, []);
		return new Rot13Client(HttpClient.create());
	}

	static createNull(options) {
		const httpResponses = nullHttpResponses(options);
		return new Rot13Client(HttpClient.createNull({
			"/rot13/transform": httpResponses,
		}));
	}

	constructor(httpClient) {
		this._httpClient = httpClient;
		this._emitter = new EventEmitter();
	}

	async transformAsync(port, text) {
		ensure.signature(arguments, [ Number, String ]);

		this._emitter.emit(REQUEST_EVENT, { port, text });

		const response = await this._httpClient.requestAsync({
			host: HOST,
			port,
			method: "POST",
			path: "/rot13/transform",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ text }),
		});

		let parsedBody = validateAndParseResponse(response, port);
		return parsedBody.transformed;
	}

	trackRequests() {
		return infrastructureHelper.trackOutput(this._emitter, REQUEST_EVENT);
	}

};

function validateAndParseResponse(response, port) {
	if (response.status !== 200) {
		throwError("Unexpected status from ROT-13 service", port, response);
	}
	if (response.body === "") {
		throwError("Body missing from ROT-13 service", port, response);
	}

	let parsedBody;
	try {
		parsedBody = JSON.parse(response.body);
	}
	catch(err) {
		throwError(`Unparseable body from ROT-13 service: ${err.message}`, port, response);
	}

	const typeError = type.check(parsedBody, RESPONSE_TYPE, { name: "body", allowExtraKeys: true });
	if (typeError !== null) {
		throwError(`Unexpected body from ROT-13 service: ${typeError}`, port, response);
	}
	return parsedBody;
}

function throwError(message, port, response) {
	throw new Error(
`${message}
Host: ${HOST}:${port}
Endpoint: /rot13/transform
Status: ${response.status}
Headers: ${JSON.stringify(response.headers)}
Body: ${response.body}`
	);
}


function nullHttpResponses(responses = [{}]) {
	ensure.signature(arguments, [[ undefined, Array ]]);
	return responses.map((response) => nullHttpResponse(response));
}

function nullHttpResponse({
	response = "Null Rot13Client response",
	error,
} = {}) {
	ensure.signature(arguments, [[ undefined, {
		response: [ undefined, String ],
		error: [ undefined, String ],
	}]]);

	if (error !== undefined) {
		return {
			status: 500,
			headers: {},
			body: error,
		};
	}
	else {
		return {
			status: 200,
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ transformed: response }),
		};
	}
}
