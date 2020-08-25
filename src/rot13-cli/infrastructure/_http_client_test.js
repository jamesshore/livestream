// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("util/assert");
const http = require("http");
const HttpClient = require("./http_client");

const HOST = "localhost";
const PORT = 5001;

describe("HTTP Client", function() {

	let server;

	before(async function() {
		server = new SpyServer();
		await server.startAsync();
	});

	after(async function() {
		await server.stopAsync();
	});

	beforeEach(function() {
		server.reset();
	});

	it("performs request and returns response", async function() {
		server.setResponse({
			status: 999,
			headers: { myResponseHeader: "myResponseValue" },
			body: "my response",
		});

		const client = HttpClient.create();
		const response = await client.requestAsync({
			host: HOST,
			port: PORT,
			method: "POST",
			path: "/my/path",
			headers: { myRequestHeader: "myRequestValue" },
			body: "my request body"
		});

		assert.deepEqual(server.lastRequest, {
			method: "POST",
			path: "/my/path",
			headers: { myrequestheader: "myRequestValue" },
			body: "my request body"
		}, "request");
		assert.deepEqual(response, {
			status: 999,
			headers: { myresponseheader: "myResponseValue" },
			body: "my response",
		}, "response");
	});

	it("headers and body are optional", async function() {
		const client = HttpClient.create();
		await client.requestAsync({
			host: HOST,
			port: PORT,
			method: "GET",
			path: "/my/new/path",
		});

		assert.deepEqual(server.lastRequest, {
			method: "GET",
			path: "/my/new/path",
			headers: {},
			body: "",
		});
	});

});


class SpyServer {

	constructor() {
		this.reset();
	}

	reset() {
		this.lastRequest = null;
		this._nextResponse = {
			status: 500,
			headers: {},
			body: "SpyServer response not specified",
		};
	}

	startAsync() {
		return new Promise((resolve, reject) => {
			this._server = http.createServer();
			this._server.on("request", (request, response) => {
				let body = "";
				request.on("data", (chunk) => {
					body += chunk;
				});
				request.on("end", () => {
					const headers = { ...request.headers };
					delete headers.connection;
					delete headers["content-length"];
					delete headers.host;
					this.lastRequest = {
						method: request.method,
						path: request.url,
						headers,
						body,
					};

					response.statusCode = this._nextResponse.status;
					Object.entries(this._nextResponse.headers).forEach(([ key, value ]) => {
						response.setHeader(key, value);
					});

					response.end(this._nextResponse.body);
				});
			});

			this._server.once("listening", () => {
				resolve();
			});

			this._server.listen(PORT);
		});
	}

	stopAsync() {
		return new Promise((resolve, reject) => {
			this._server.once("close", () => {
				resolve();
			});
			this._server.close();
		});
	}

	setResponse(response) {
		this._nextResponse = response;
	}

}