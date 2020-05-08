// Copyright Titanium I.T. LLC.
"use strict";

module.exports = class Hand {

	constructor(hand, starterCard) {
		this._hand = hand;
		this._starterCard = starterCard;
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

		const jacks = this._hand.filter((card) => card.rank === "J");
		if (jacks.length > 0 && jacks[0].suit === starterSuit) return 1;
		else return 0;
	}

};