// Copyright Titanium I.T. LLC.
"use strict";

module.exports = class Hand {

	constructor(hand, starterCard) {
		this._hand = hand;
		this._starterCard = starterCard;
	}

	countPairs() {
		const allCombos = this.allCombinations();
		const pairs = allCombos.filter((combo) => combo.length === 2 && combo[0].rank === combo[1].rank);
		return pairs.length;
	}

	countHisNibs() {
		const starterSuit = this._starterCard.suit;

		const nibs = this._hand.filter((card) => card.rank === "J" && card.suit === starterSuit);
		return nibs.length;
	}

	allCombinations(cards) {
		const allCards = [ ...this._hand, this._starterCard ];
		return allCombinations(allCards);
	}

};


function allCombinations(cards) {
	if (cards.length === 0) return [];

	const [firstCard, ...remainingCards] = cards;
	const allRemainingCombos = allCombinations(remainingCards);
	const combosWithFirstCard = allRemainingCombos.map((combo) => [firstCard, ...combo]);
	return [[firstCard], ...combosWithFirstCard, ...allRemainingCombos];
}
