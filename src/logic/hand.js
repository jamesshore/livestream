// Copyright Titanium I.T. LLC.
"use strict";

module.exports = class Hand {

	constructor(hand, starterCard) {
		this._hand = hand;
		this._starterCard = starterCard;
	}

	static allCombinations(cards) {
		if (cards.length === 0) return [];

		const [ firstCard, ...remainingCards ] = cards;
		const allRemainingCombos = this.allCombinations(remainingCards);
		const combosWithFirstCard = allRemainingCombos.map((combo) => [ firstCard, ...combo ]);
		return [ [ firstCard ], ...combosWithFirstCard, ...allRemainingCombos ];
	}

	scorePairs() {
		const allCards = [ ...this._hand, this._starterCard ];
		const allCombinations = Hand.allCombinations(allCards);
		const pairs = allCombinations.filter((combo) => combo.length === 2 && combo[0].rank === combo[1].rank);
		return pairs.length * 2;
	}

	scoreHisNibs() {
		const starterSuit = this._starterCard.suit;

		const nibs = this._hand.filter((card) => card.rank === "J" && card.suit === starterSuit);
		if (nibs.length > 1) {
			throw new Error(`too many nibs: ${this._hand.join(", ")} matching ${this._starterCard}`);
		}

		return nibs.length;
	}

};

