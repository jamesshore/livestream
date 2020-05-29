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

	countStraightCards() {
		const potentialStraights = this.allCombinations().filter((combo) => combo.length >= 3);
		const actualStraights = potentialStraights.filter((cards) => isStraight(cards));
		if (actualStraights.length === 0) return 0;

		const largestStraightsFirst = actualStraights.sort((a, b) => b.length - a.length);
		const lengthOfAllStraights = largestStraightsFirst[0].length;
		const fullStraights = largestStraightsFirst.filter((straight) => straight.length === lengthOfAllStraights);
		return lengthOfAllStraights * fullStraights.length;

		function isStraight(cards) {
			const sortedCards = cards.sort((a, b) => a.numericRank - b.numericRank);
			for (let cardNum = 1; cardNum < cards.length; cardNum++) {
				const myRank = sortedCards[cardNum].numericRank;
				const previousRank = sortedCards[cardNum - 1].numericRank;
				if (myRank !== previousRank + 1) return false;
			}
			return true;
		}
	}

	countFifteens() {
		const fifteens = this.allCombinations().filter((cards) => isFifteen(cards));
		return fifteens.length;

		function isFifteen(cards) {
			const score = cards.reduce((score, card) => score + card.value, 0);
			return score === 15;
		}
	}

	countFlushCards() {
		const targetSuit = this._hand[0].suit;
		const isFlush = this._hand.every((card) => card.suit === targetSuit);
		if (!isFlush) return 0;

		const starterMatches = this._starterCard.suit === targetSuit;
		return starterMatches ? 5 : 4;
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
