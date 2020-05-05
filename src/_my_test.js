// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert");
const rot13 = require("./rot13");

describe("ROT-13", function() {

	it("does nothing when input is empty", function() {
		assert.equal(rot13.transform(""), "");
	});

	it("transforms lower-case letters", function() {
		assert.equal(rot13.transform("abcdefghijklmnopqrstuvwxyz"), "nopqrstuvwxyzabcdefghijklm");
	});

	it("tranforms upper-case letters", function() {
		assert.equal(rot13.transform("ABCDEFGHIJKLMNOPQRSTUVWXYZ"), "NOPQRSTUVWXYZABCDEFGHIJKLM");
	});

	it("doesn't transform symbols", function() {
		assertNoTransform("`{@[");
	});

	it("doesn't transform numbers", function() {
		assertNoTransform("1234567890");
	});

	it("doesn't transform non-English letters", function() {
		assertNoTransform("åéîøüçñ");
	});

	it("doesn't break when given emojis", function() {
		assertNoTransform("✅🚫🙋");
	});

	it("fails fast when no parameter provided", function() {
		assert.throws(
			() => rot13.transform(),
			"Expected string parameter"
		);
	});

	it("fails fast when wrong parameter type provided", function() {
		assert.throws(
			() => rot13.transform(123),
			"Expected string parameter"
		);
	});

});

function assertNoTransform(input) {
	assert.equal(rot13.transform(input), input);
}