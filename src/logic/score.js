// Copyright Titanium I.T. LLC.
"use strict";

const parser = require("./parser");

exports.analyze = function(cardsString) {
	const hand = parser.parseHand(cardsString);

	return hand.countPairs() * 2 +
		hand.countHisNibs() +
		hand.countStraightCards() +
		hand.countFifteens() * 2 +
		hand.countFlushCards();
};