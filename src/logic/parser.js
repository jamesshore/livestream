// Copyright Titanium I.T. LLC.
"use strict";

const Card = require("./card.js");
const Hand = require("./hand.js");

const VALID_RANKS = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "0", "J", "Q", "K" ];
const VALID_SUITS = [ "D", "H", "C", "S" ];

exports.parseHand = function(handString) {
	ensureValidHand(handString);

	const handRegex = /^(..)(..)(..)(..)(..)$/;
	const groups = handString.match(handRegex);

	return new Hand([
		exports.parseCard(groups[1]),
		exports.parseCard(groups[2]),
		exports.parseCard(groups[3]),
		exports.parseCard(groups[4]),
	], exports.parseCard(groups[5]));
};

exports.parseCard = function(cardString) {
	const rank = cardString[0];
	const suit = cardString[1];

	if (!VALID_RANKS.includes(rank)) throw new Error(`Unrecognized rank: ${rank}`);
	if (!VALID_SUITS.includes(suit)) throw new Error(`Unrecognized suit: ${suit}`);

	return new Card(rank, suit);
};

function ensureValidHand(handString) {
	if (handString === undefined) throw new Error("Need to provide hand of cards");
	if (handString.length > 10) throw new Error(`Too many cards in hand: ${handString}`);
	if (handString.length < 10) throw new Error(`Not enough cards in hand: ${handString}`);
}