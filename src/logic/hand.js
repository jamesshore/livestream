// Copyright Titanium I.T. LLC.
"use strict";

module.exports = class Hand {

	constructor(hand, starterCard) {
		this._hand = hand;
		this._starterCard = starterCard;
	}

	static allCombinationsStrings(cards) {
		const firstCard = cards[0];
		let remainingCombos;
		if (cards.length > 1) {
			remainingCombos = this.allCombinationsStrings(cards.slice(1));
			return [ [ firstCard ], ...remainingCombos, cards ];
		}
		else {
			return [ cards ];
		}

	}

	static allCombinations(cards, depth = 0) {
		const allCards = cards;
		const firstCard = [ cards[0] ];

		if (cards.length > 1) {
			const remainingCards = this.allCombinations(cards.slice(1), depth + 1)[0];

			console.log(depth, "FIRST CARD", firstCard);
			console.log(depth, "REMAINING CARDS", remainingCards);
			console.log(depth, "ALL CARDS", allCards);

			return [ firstCard, remainingCards, allCards ];
		}
		else {
			console.log(depth, "BASE CASE", firstCard);

			return [ firstCard ];
		}

	}

	scorePairs() {
		const ranks = this._hand.map((card) => card.rank);
		ranks.push(this._starterCard.rank);

		let score = 0;
		for (let i = 0; i < ranks.length; i++) {
			const firstCard = ranks[i];
			for (let j = i + 1; j < ranks.length; j++) {
				if (firstCard === ranks[j]) score +=2;
			}
		}

		return score;
	}

	scoreHisNibs() {
		const starterSuit = this._starterCard.suit;

		const nibs = this._hand.filter((card) => card.rank === "J" && card.suit === starterSuit);
		if (nibs.length > 1) {
			throw new Error(`too many nibs: ${this._hand.join(", ")} matching ${this._starterCard}`);
		}

		return nibs.length;
	}

	allCombinations(allCards) {

	}

};

