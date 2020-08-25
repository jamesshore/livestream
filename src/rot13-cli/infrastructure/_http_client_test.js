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

	it("fails fast if providing body with GET request (which doesn't allow body)", async function() {
		const client = HttpClient.createNull();
		await assert.throwsAsync(
			() => client.requestAsync({ host: HOST, port: PORT, method: "GET", path: "/irrelevant", body: "oops" }),
			"Don't include body with GET requests; Node won't send it"
		);
	});

	it("tracks requests (which normalizes method and header names)", async function() {
		const client = HttpClient.createNull();
		const requests = client.trackRequests();

		await client.requestAsync({
			host: HOST,
			port: PORT,
			method: "POST",
			headers: { myHeader: "myValue" },
			path: "/my/path",
			body: "my body",
		});
		assert.deepEqual(requests, [{
			host: HOST,
			port: PORT,
			method: "post",
			headers: { myheader: "myValue" },
			path: "/my/path",
			body: "my body",
		}]);
	});


	describe("nullability", function() {

		const IRRELEVANT_REQUEST = {
			host: HOST,
			port: PORT,
			method: "GET",
			path: "/irrelevant/path",
		};

		it("doesn't talk to network", async function() {
			const client = HttpClient.createNull();
			await client.requestAsync(IRRELEVANT_REQUEST);

			assert.equal(server.lastRequest, null);
		});

		it("provides default response", async function() {
			const client = HttpClient.createNull();
			const response = await client.requestAsync(IRRELEVANT_REQUEST);
			assert.deepEqual(response, {
				status: 503,
				headers: { nullhttpclient: "default header"},
				body: "Null HttpClient default response",
			});
		});

		it("provides multiple responses for multiple endpoints (and normalizes header names)", async function() {
			const client = HttpClient.createNull({
				"/endpoint/1": [
					{ status: 200, headers: { myHeader: "myValue" }, body: "endpoint 1 body" },
					{ status: 404 },
				],
				"/endpoint/2": [
					{ status: 301, body: "endpoint 2 body" },
				],
			});

			const response1a = await client.requestAsync({ host: HOST, port: PORT, method: "GET", path: "/endpoint/1" });
			const response2 = await client.requestAsync({ host: HOST, port: PORT, method: "GET", path: "/endpoint/2" });
			const response1b = await client.requestAsync({ host: HOST, port: PORT, method: "GET", path: "/endpoint/1" });

			assert.deepEqual(response1a, {
				status: 200,
				headers: { myheader: "myValue" },
				body: "endpoint 1 body",
			});
			assert.deepEqual(response2, {
				status: 301,
				headers: {},
				body: "endpoint 2 body",
			});
			assert.deepEqual(response1b, {
				status: 404,
				headers: {},
				body: "",
			});
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