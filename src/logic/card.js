// Copyright Titanium I.T. LLC.
"use strict";

const NUMERIC_RANKS = {
	"A": 1,
	"2": 2,
	"3": 3,
	"4": 4,
	"5": 5,
	"6": 6,
	"7": 7,
	"8": 8,
	"9": 9,
	"0": 10,
	"J": 11,
	"Q": 12,
	"K": 13,
};

module.exports = class Card {

	constructor(rank, suit) {
		this._rank = rank;
		this._suit = suit;
	}

	get rank() {
		return this._rank;
	}

	get numericRank() {
		return NUMERIC_RANKS[this._rank];
	}

	get suit() {
		return this._suit;
	}

	toString() {
		return `${this._rank}${this._suit}`;
	}

};