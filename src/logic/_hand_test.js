// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("../util/assert");
const Hand = require("./hand.js");
const Card = require("./card.js");
const parser = require("./parser.js");

describe("Hand", function() {


	describe("Pairs", function() {

		it("no pairs", function() {
			const hand = createHand("AC", "2C", "QS", "3H", "0C");
			assert.equal(hand.countPairs(), 0);
		});

		it("one pair", function() {
			const hand = createHand("AC", "AC", "QS", "3H", "0C");
			assert.equal(hand.countPairs(), 1);
		});

		it("pair with starter card", function() {
			const hand = createHand("QS", "AC", "3H", "0C", "AC");
			assert.equal(hand.countPairs(), 1);
		});

		it("multiple pairs", function() {
			const hand = createHand("QS", "AC", "QH", "AH", "5D");
			assert.equal(hand.countPairs(), 2);
		});

		it("triple", function() {
			const hand = createHand("QS", "AC", "3H", "AH", "AD");
			assert.equal(hand.countPairs(), 3);
		});

	});


	describe("His Nibs", function() {

		it("no jacks", function() {
			const hand = createHand("2H", "3C", "4S", "5D", "6H");
			assert.equal(hand.countHisNibs(), 0);
		});

		it("jack that doesn't match starter card suit", function() {
			const hand = createHand("2H", "JC", "4S", "5D", "6H");
			assert.equal(hand.countHisNibs(), 0);
		});

		it("jack that matches starter card suit", function() {
			const hand = createHand("2H", "JH", "4S", "JD", "6D");
			assert.equal(hand.countHisNibs(), 1);
		});

		it("multiple matching jacks (we don't care about cheating)", function() {
			const hand = createHand("2H", "JD", "4S", "JD", "6D");
			assert.equal(hand.countHisNibs(), 2);
		});

	});


	describe("Straights", function() {

		it("not a straight", function() {
			const hand = createHand("2H", "JD", "4S", "JD", "6D");
			assert.equal(hand.countStraightCards(), 0);
		});

		it("two cards don't make a straight", function() {
			const hand = createHand("2H", "3D", "6S", "JD", "6D");
			assert.equal(hand.countStraightCards(), 0);
		});

		it("three cards do make a straight", function() {
			const hand = createHand("2H", "3D", "4S", "JD", "6D");
			assert.equal(hand.countStraightCards(), 3);
		});

		it("doesn't count cards in a straight more than once", function() {
			const hand = createHand("2H", "3D", "4S", "5D", "QD");
			assert.equal(hand.countStraightCards(), 4);
		});

		it("is a straight when non-numeric cards are included", function() {
			assert.equal(createHand("AD", "2C", "3D", "4S", "5D").countStraightCards(), 5);
			assert.equal(createHand("9C", "0D", "JS", "QD", "KH").countStraightCards(), 5);
		});

		it("is a straight when not in order", function() {
			const hand = createHand("2C", "5D", "4S", "6D", "3D");
			assert.equal(hand.countStraightCards(), 5);
		});

		it("counts multiple straights", function() {
			const hand = createHand("2C", "3D", "3S", "3D", "4D");
			assert.equal(hand.countStraightCards(), 9);
		});

	});


	describe("Fifteens", function() {

		it("no fifteens", function() {
			const hand = createHand("2C", "AD", "9S", "KD", "QD");
			assert.equal(hand.countFifteens(), 0);
		});

		it("one fifteen", function() {
			const hand = createHand("2C", "6D", "AS", "3D", "3D");
			assert.equal(hand.countFifteens(), 1);
		});

		it("multiple fifteen", function() {
			const hand = createHand("QC", "KD", "5S", "5D", "5D");
			assert.equal(hand.countFifteens(), 7);
		});

	});


	describe("Flushes", function() {

		it("no flush", function() {
			const hand = createHand("QC", "KD", "5S", "5D", "5D");
			assert.equal(hand.countFlushCards(), 0);
		});

		it("must have at least four cards", function() {
			const hand = createHand("QC", "KC", "5C", "5S", "5D");
			assert.equal(hand.countFlushCards(), 0);
		});

		it("all cards in hand must be same suit", function() {
			const hand = createHand("QC", "KC", "5C", "6C", "5D");
			assert.equal(hand.countFlushCards(), 4);
		});

		it("can include starter card", function() {
			const hand = createHand("QC", "KC", "5C", "6C", "7C");
			assert.equal(hand.countFlushCards(), 5);
		});

	});


	describe("Card combinations", function() {

		it("provides all combinations of cards", function() {
			const hand = createHand("AC", "2C", "3C", "4C", "5C");
			assert.deepEqual(allCombinations(hand), [
				['AC'],
				['AC', '2C'],
				['AC', '2C', '3C'],
				['AC', '2C', '3C', '4C'],
				['AC', '2C', '3C', '4C', '5C'],
				['AC', '2C', '3C', '5C'],
				['AC', '2C', '4C'],
				['AC', '2C', '4C', '5C'],
				['AC', '2C', '5C'],
				['AC', '3C'],
				['AC', '3C', '4C'],
				['AC', '3C', '4C', '5C'],
				['AC', '3C', '5C'],
				['AC', '4C'],
				['AC', '4C', '5C'],
				['AC', '5C'],
				['2C'],
				['2C', '3C'],
				['2C', '3C', '4C'],
				['2C', '3C', '4C', '5C'],
				['2C', '3C', '5C'],
				['2C', '4C'],
				['2C', '4C', '5C'],
				['2C', '5C'],
				['3C'],
				['3C', '4C'],
				['3C', '4C', '5C'],
				['3C', '5C'],
				['4C'],
				['4C', '5C'],
				['5C']
			]);

		});

		function allCombinations(hand) {
			const allCombos = hand.allCombinations();
			return allCombos.map((combo) => {
				return combo.map((card) => card.toString());
			});
		}

	});

});

function createHand(...cards) {
	if (cards.length !== 5) throw new Error("wrong number of cards: " + cards.length);

	cards = cards.map((card) => parser.parseCard(card));

	const hand = cards.slice(0, 4);
	const starter = cards[4];

	return new Hand(hand, starter);
}