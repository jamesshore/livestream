// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert.js");
const Hand = require("./hand.js");
const Card = require("./card.js");
const parser = require("./parser.js");

describe("Hand", function() {

	describe("Pairs", function() {

		it("doesn't score hands with no pairs", function() {
			const hand = createHand("AC", "2C", "QS", "3H", "0C");
			assert.equal(hand.scorePairs(), 0);
		});

		it("scores pairs", function() {
			const hand = createHand("AC", "AC", "QS", "3H", "0C");
			assert.equal(hand.scorePairs(), 2);
		});

		it("scores pairs when they're not next to each other", function() {
			const hand = createHand("AC", "QS", "AC", "3H", "0C");
			assert.equal(hand.scorePairs(), 2);
		});

		it("scores pairs when the first card isn't in the pair", function() {
			const hand = createHand("QS", "AC", "3H", "AC", "0C");
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

		it("scores quadruple", function() {
			const hand = createHand("AC", "AH", "AD", "AS", "QS");
			assert.equal(hand.scorePairs(), 12);
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
			const hand = createHand("2H", "JH", "4S", "5D", "6H");
			assert.equal(hand.scoreHisNibs(), 1);
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