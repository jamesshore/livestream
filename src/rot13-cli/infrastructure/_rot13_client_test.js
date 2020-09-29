// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("util/assert");
const HttpClient = require("./http_client");
const Rot13Client = require("./rot13_client");
const Rot13Server = require("../../rot13-service/rot13_server");
const testHelper = require("util/test_helper");

const HOST = "localhost";
const IRRELEVANT_PORT = 42;
const IRRELEVANT_TEXT = "irrelevant text";

const VALID_STATUS = 200;
const VALID_HEADERS = { "content-type": "application/json" };
const VALID_BODY_TEXT = "transformed_text";
const VALID_BODY = JSON.stringify({ transformed: VALID_BODY_TEXT });

describe("ROT-13 Service client", function() {

	describe("happy path", function() {

		it("transforms ROT-13 text by delegating to provider", async function() {
			const rot13Client = Rot13Client.create();
			const expected = await Rot13Server.transformAsync("text_to_transform");
			const actual = await rot13Client.transformAsync("text_to_transform");
			assert.equal(actual, expected);
		});

		it("tracks requests", async function() {
			const rot13Client = Rot13Client.create();
			const requests = rot13Client.trackRequests();

			await rot13Client.transformAsync("my text");
			assert.deepEqual(requests, [{
				text: "my text",
			}]);
		});

	});


	describe("nullability", function() {

		it("provides default response", async function() {
			const rot13Client = Rot13Client.createNull();
			const response = await rot13Client.transformAsync(IRRELEVANT_TEXT);
			assert.equal(response, "Null Rot13Client response");
		});

		it("can configure response", async function() {
			const rot13Client = Rot13Client.createNull({ response: "my response" });

			const response = await rot13Client.transformAsync(IRRELEVANT_TEXT);
			assert.equal(response, "my response");
		});

		it("can force an error", async function() {
			const rot13Client = Rot13Client.createNull({ error: "my error" });
			await assert.throwsAsync(
				() => rot13Client.transformAsync(IRRELEVANT_TEXT),
				/my error/
			);
		});

	});

});

function createClient({
	status = VALID_STATUS,
	headers = VALID_HEADERS,
	body = VALID_BODY,
} = {}) {
	const httpClient = HttpClient.createNull({
		"/rot13/transform": [{ status, headers, body }],
	});
	const httpRequests = httpClient.trackRequests();

	const rot13Client = new Rot13Client(httpClient);
	return { httpRequests, rot13Client };
}

async function transformAsync(rot13Client, port, text) {
	return await rot13Client.oldTransform(port, text).transformPromise;
}

async function assertFailureAsync({
	status = VALID_STATUS,
	headers = VALID_HEADERS,
	body = VALID_BODY,
	message,
} = {}) {
	const { rot13Client } = createClient({ status, headers, body });
	await assert.throwsAsync(
		() => transformAsync(rot13Client, 9999, IRRELEVANT_TEXT),
		`${message}\n` +
		`Host: ${HOST}:9999\n` +
		"Endpoint: /rot13/transform\n" +
		`Status: ${status}\n` +
		`Headers: ${JSON.stringify(headers)}\n` +
		`Body: ${body}`
	);
}
