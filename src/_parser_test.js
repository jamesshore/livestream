// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert.js");
const parser = require("./parser.js");
const Card = require("./card.js");
const Hand = require("./hand.js");

describe("Parsing", function() {

	describe("Hand", function() {

		it("parses a set of five cards", function() {
			const expected = new Hand([
				new Card("A", "C"),
				new Card("K", "D"),
				new Card("Q", "S"),
				new Card("J", "H"),
			], new Card("0", "C"));

			const hand = parser.parseHand("ACKDQSJH0C");
			assert.deepEqual(hand, expected);
		});

		it("fails fast when there's too many cards", function() {
			assert.throws(
				() => parser.parseHand("AC2H3C4H5D6C"),
				"Too many cards in hand: AC2H3C4H5D6C"
			);
		});

		it("fails fast when there's too few cards", function() {
			assert.throws(
				() => parser.parseHand("AC2H3C4H"),
				"Not enough cards in hand: AC2H3C4H"
			);
		});

		it("fails fast when there's no parameter", function() {
			assert.throws(
				() => parser.parseHand(),
				"Need to provide hand of cards"
			);
		});

	});

	describe("Card", function() {

		it("parses suit and rank for a single card", function() {
			const card = parser.parseCard("2S");
			assert.deepEqual(card, new Card("2", "S"));
		});

		it("fails fast if rank is not recognized", function() {
			assert.throws(
				() => parser.parseCard("XS"),
				"Unrecognized rank: X"
			);
		});

		it("fails fast if suit is not recognized", function() {
			assert.throws(
				() => parser.parseCard("2X"),
				"Unrecognized suit: X"
			);
		});

	});

});