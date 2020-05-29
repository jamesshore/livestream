// Copyright Titanium I.T. LLC.
"use strict";

const score = require("./score");
const assert = require("../util/assert");

describe("Score", function() {

	it("scores pairs", function() {
		assert.equal(score.analyze("ACAS9HQDKC"), 2);
	});

	it("scores his nibs", function() {
		assert.equal(score.analyze("JCAS9HQD2C"), 1);
	});

	it("scores straights", function() {
		assert.equal(score.analyze("KCQDJH0D9C"), 5);
	});

	it("scores fifteens", function() {
		assert.equal(score.analyze("5C6DAHQDKC"), 4);
	});

	it("scores flushes", function() {
		assert.equal(score.analyze("AC2C9CQCKC"), 5);
	});

	it("scores everything together", function() {
		assert.equal(score.analyze("JH5D5S5C5H"), 29);
	});

});