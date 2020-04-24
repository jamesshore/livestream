// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert.js");

module.exports = class CssHelper {

	assertBorderRadius(element, radius) {
		assert.equal(element.getRawStyle("border-top-left-radius"), radius);
		assert.equal(element.getRawStyle("border-top-right-radius"), radius);
		assert.equal(element.getRawStyle("border-bottom-left-radius"), radius);
		assert.equal(element.getRawStyle("border-bottom-right-radius"), radius);
	}

	assertBackgroundColor(element, backgroundColor) {
		assert.equal(element.getRawStyle("background-color"), backgroundColor);
	}

	assertBoxShadow(element, shadow) {
		assert.equal(element.getRawStyle("box-shadow"), shadow);
	}

	assertOverflowHidden(element) {
		assert.equal(element.getRawStyle("overflow"), "hidden");
	}

};
