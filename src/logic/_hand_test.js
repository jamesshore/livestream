// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("../util/assert");
const Hand = require("./hand.js");
const Card = require("./card.js");
const parser = require("./parser.js");

describe("Hand", function() {

	describe("Card combinations", function() {

		it("provides all combinations of cards", function() {
			assert.deepEqual(allCombinations("AC", "2C", "3C"), [
				[ "AC" ],
				[ "AC", "2C" ],
				[ "AC", "2C", "3C" ],
				[ "AC", "3C" ],
				[ "2C" ],
				[ "2C", "3C" ],
				[ "3C" ],
			]);

		});

		function allCombinations(...cardStrings) {
			const cards = cardStrings.map((cardString) => parser.parseCard(cardString));
			const allCombos = Hand.allCombinations(cards);

			return allCombos.map((combo) => {
				return combo.map((card) => card.toString());
			});
		}

	});

	describe("Pairs", function() {

		it("doesn't score hands with no pairs", function() {
			const hand = createHand("AC", "2C", "QS", "3H", "0C");
			assert.equal(hand.scorePairs(), 0);
		});

		it("scores pairs", function() {
			const hand = createHand("AC", "AC", "QS", "3H", "0C");
			assert.equal(hand.scorePairs(), 2);
		});

		it("scores pairs when one of the cards is the starter card", function() {
			const hand = createHand("QS", "AC", "3H", "0C", "AC");
			assert.equal(hand.scorePairs(), 2);
		});

		it("scores multiple pairs", function() {
			const hand = createHand("QS", "AC", "QH", "AH", "5D");
			assert.equal(hand.scorePairs(), 4);
		});

		it("scores triple", function() {
			const hand = createHand("QS", "AC", "3H", "AH", "AD");
			assert.equal(hand.scorePairs(), 6);
		});

	});

	describe("His Nibs", function() {

		it("hands without jacks score 0", function() {
			const hand = createHand("2H", "3C", "4S", "5D", "6H");
			assert.equal(hand.scoreHisNibs(), 0);
		});

		it("hands with jacks that don't match starter card suit score 0", function() {
			const hand = createHand("2H", "JC", "4S", "5D", "6H");
			assert.equal(hand.scoreHisNibs(), 0);
		});

		it("hands with a jack that matches starter card suit score 1", function() {
			const hand = createHand("2H", "JH", "4S", "JD", "6D");
			assert.equal(hand.scoreHisNibs(), 1);
		});

		it("fails fast if there are multiple matching jacks", function() {
			const hand = createHand("2H", "JD", "4S", "JD", "6D");
			assert.throws(
				() => hand.scoreHisNibs(),
				"too many nibs: 2H, JD, 4S, JD matching 6D"
			);
		});

	});

});

function createHand(...cards) {
	if (cards.length !== 5) throw new Error("wrong number of cards: " + cards.length);

	cards = cards.map((card) => parser.parseCard(card));

	const hand = cards.slice(0, 4);
	const starter = cards[4];

	return new Hand(hand, starter);
}