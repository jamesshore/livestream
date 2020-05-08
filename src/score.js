// Copyright Titanium I.T. LLC.
"use strict";

const parser = require("./parser");

exports.analyze = function(cardsString) {
	parser.parseHand(cardsString);
	return 19;
};