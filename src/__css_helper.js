// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert.js");

exports.assertBorderRadius = function(element, radius) {
	assert.equal(element.getRawStyle("border-top-left-radius"), radius);
	assert.equal(element.getRawStyle("border-top-right-radius"), radius);
	assert.equal(element.getRawStyle("border-bottom-left-radius"), radius);
	assert.equal(element.getRawStyle("border-bottom-right-radius"), radius);
};

exports.assertBackgroundColor = function(element, backgroundColor) {
	assert.equal(element.getRawStyle("background-color"), backgroundColor);
};

exports.assertBoxShadow = function(element, shadow) {
	assert.equal(element.getRawStyle("box-shadow"), shadow);
};

exports.assertOverflowHidden = function(element) {
	assert.equal(element.getRawStyle("overflow"), "hidden");
};
