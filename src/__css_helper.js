// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert.js");


module.exports = class CssHelper {

	constructor(frame) {
		this._body = frame.body();
	}

	get CONTENT_BACKGROUND() {
		return this.getCssVariable("--background-white");
	}

	get BACKGROUND_BLUE() {
		return this.getCssVariable("--background-blue");
	}

	get DROP_SHADOW() {
		return this.getCssVariable("--drop-shadow");
	}

	get WHITESPACE() {
		const pixelString = this.getCssVariable("--standard-gap");
		return parseInt(pixelString, 10);
	}

	getCssVariable(name) {
		return this._body.getRawStyle(name).trim();
	}

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
