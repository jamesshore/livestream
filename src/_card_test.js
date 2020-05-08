// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert");
const Card = require("./card");

describe("Card", function() {

	it("has a rank", function() {
		const card = new Card("3", "C");
		assert.equal(card.rank, "3");
	});

	it("has a suit", function() {
		const card = new Card("3", "C");
		assert.equal(card.suit, "C");
	});

});