// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("util/assert");
const Server = require("./rot13_server");
const rot13 = require("./logic/rot13");

describe("ROT-13 Server", function() {

	it("publishes function to transform text via ROT-13", async function() {
		const expected = rot13.transform("my text");
		const actual = await Server.transformAsync("my text");
		assert.equal(actual, expected);
	});

});
