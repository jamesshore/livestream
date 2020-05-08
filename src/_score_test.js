// Copyright Titanium I.T. LLC.
"use strict";

const score = require("./score");
const assert = require("./assert");

describe("Score", function() {

	it("isn't implemented", function() {
		assert.equal(score.analyze("JH5D5S5C5H"), 19);
	});

});