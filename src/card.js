// Copyright Titanium I.T. LLC.
"use strict";

module.exports = class Card {

	constructor(rank, suit) {
		this._rank = rank;
		this._suit = suit;
	}

	get rank() {
		return this._rank;
	}

};