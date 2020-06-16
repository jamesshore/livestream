// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("../util/assert");
const http = require("http");
const HttpServer = require("./http_server");
const testHelper = require("../util/test_helper");

const PORT = 5001;

describe("HTTP Server", function() {

	describe("starting and stopping", function() {

		it("starts and stops server (and can do so multiple times)", async function() {
			const server = HttpServer.create();

			await startAsync(server);
			await stopAsync(server);
			await startAsync(server);
			await stopAsync(server);
		});

		it("says if the server is started", async function() {
			const server = HttpServer.create();
			assert.equal(server.isStarted, false, "before server started");
			await startAsync(server);
			try {
				assert.equal(server.isStarted, true, "after server started");
			}
			finally {
				await stopAsync(server);
				assert.equal(server.isStarted, false, "after server stopped");
			}
		});

		it("fails gracefully if server has startup error", async function() {
			await startAndStopAsync({}, async () => {
				const server = HttpServer.create();
				await assert.throwsAsync(
					() => startAsync(server),     // fails because another server is already running
					/^Couldn't start server due to error:.*?EADDRINUSE/
				);
			});
		});

		it("fails fast if server is started twice", async function() {
			await startAndStopAsync({}, async (server) => {
				await assert.throwsAsync(
					() => startAsync(server),
					"Can't start server because it's already running"
				);
			});
		});

		it("fails fast if server is stopped when it isn't running", async function() {
			const server = HttpServer.create();
			await assert.throwsAsync(
				() => stopAsync(server),
				"Can't stop server because it isn't running"
			);
		});

	});


	describe("requests and responses", function() {

		it("runs a function when a request is received and serves the result", async function() {
			const expectedResponse = {
				status: 777,
				headers: {
					header1: "value1",
					header2: "value2",
				},
				body: "my body",
			};
			function onRequestAsync() { return expectedResponse; }

			const response = await getAsync({ onRequestAsync });
			assert.deepEqual(response, expectedResponse);
		});

		it("simulates requests", async function() {
			const expectedResponse = {
				status: 777,
				headers: { myheader: "myvalue" },
				body: "my body"
			};
			function onRequestAsync() { return expectedResponse; }

			const server = HttpServer.createNull();
			await startAsync(server, { onRequestAsync });

			const response = await server.simulateRequestAsync();
			assert.deepEqual(response, expectedResponse);
		});

		it("simulating requests fails fast when server isn't running", async function() {
			const server = HttpServer.createNull();
			await assert.throwsAsync(
				() => server.simulateRequestAsync(),
				"Can't simulate request because server isn't running"
			);
		});

		it("fails gracefully when request handler throws exception", async function() {
			function onRequestAsync() { throw new Error("onRequestAsync error"); }

			const response = await getAsync({ onRequestAsync });
			assert.deepEqual(response, {
				status: 500,
				headers: { "content-type": "text/plain; charset=utf-8" },
				body: "Internal Server Error: request handler threw exception",
			});
		});

		it("fails gracefully when request handler returns invalid response", async function() {
			function onRequestAsync() { return "invalid response"; }

			const response = await getAsync({ onRequestAsync });
			assert.deepEqual(response, {
				status: 500,
				headers: { "content-type": "text/plain; charset=utf-8" },
				body: "Internal Server Error: request handler returned invalid response",
			});
		});

	});


	describe("nullability", function() {

		it("doesn't actually start or stop the server", async function() {
			const server = HttpServer.createNull();
			const server2 = HttpServer.createNull();

			await startAsync(server);
			await assert.doesNotThrowAsync(
				() => startAsync(server2)     // fails if server is real because address is already in use
			);
			await stopAsync(server);
		});

	});

});


async function getAsync({ onRequestAsync }) {
	return await startAndStopAsync({ onRequestAsync }, async () => {
		return await testHelper.requestAsync({ port: PORT });
	});
}

async function startAndStopAsync(options, fnAsync) {
	const server = HttpServer.create();
	await startAsync(server, options);
	try {
		return await fnAsync(server);
	}
	finally {
		await stopAsync(server);
	}
}

async function startAsync(server, {
	onRequestAsync = () => {},
} = {}) {
	await server.startAsync({ port: PORT, onRequestAsync });
}

async function stopAsync(server) {
	await server.stopAsync();
}