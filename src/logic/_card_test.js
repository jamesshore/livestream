// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("../util/assert");
const Card = require("./card");

describe("Card", function() {

	it("has a rank", function() {
		const card = new Card("3", "C");
		assert.equal(card.rank, "3");
	});

	it("has a numeric rank", function() {
		assert.equal(new Card("A", "C").numericRank, 1);
		assert.equal(new Card("3", "C").numericRank, 3);
		assert.equal(new Card("0", "C").numericRank, 10);
		assert.equal(new Card("J", "C").numericRank, 11);
		assert.equal(new Card("Q", "C").numericRank, 12);
		assert.equal(new Card("K", "C").numericRank, 13);
	});

	it("has a suit", function() {
		const card = new Card("3", "C");
		assert.equal(card.suit, "C");
	});

	it("converts to string", function() {
		const card = new Card("3", "C");
		assert.equal(card.toString(), "3C");
	});

});