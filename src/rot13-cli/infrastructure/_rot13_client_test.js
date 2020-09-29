// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("util/assert");
const Rot13Client = require("./rot13_client");
const Rot13Server = require("../../rot13-service/rot13_server");

describe("ROT-13 Service client", function() {

	describe("happy path", function() {

		it("transforms ROT-13 text by delegating to provider", async function() {
			const rot13Client = Rot13Client.create();
			const expected = await Rot13Server.transformAsync("text_to_transform");
			const actual = await rot13Client.transformAsync("text_to_transform");
			assert.equal(actual, expected);
		});

	});

});
