// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("../util/assert");
const http = require("http");
const HttpServer = require("./http_server");

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