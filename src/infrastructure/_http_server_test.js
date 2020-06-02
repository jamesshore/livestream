// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("../util/assert");
const http = require("http");
const HttpServer = require("./http_server");

const PORT = 5001;

describe("HTTP Server", function() {

	it("starts and stops server (and can do so multiple times)", async function() {
		const server = HttpServer.create();

		await startAsync(server);
		await stopAsync(server);
		await startAsync(server);
		await stopAsync(server);
	});

	it("fails gracefully if server has startup error", async function() {
		await startAndStopAsync(async () => {
			const server = HttpServer.create();
			await assert.throwsAsync(
				() => startAsync(server),     // fails because another server is already running
				/^Couldn't start server due to error:.*?EADDRINUSE/
			);
		});
	});

	it("fails fast if server is started twice", async function() {
		await startAndStopAsync(async (server) => {
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


async function startAndStopAsync(fnAsync) {
	const server = HttpServer.create();
	await startAsync(server);
	try {
		await fnAsync(server);
	}
	finally {
		await stopAsync(server);
	}
}

async function startAsync(server) {
	await server.startAsync({ port: PORT });
}

async function stopAsync(server) {
	await server.stopAsync();
}