// Copyright (c) 2015 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

// A small modification to Chai. Why? Just to demonstrate how you can customize an assertion library
// without writing it all yourself.

const assert = require("chai").assert;

// 'module.exports = assert' doesn't work because it's a reference copy. Any changes (such as when we
// overwrite exports.fail) changes Chai's functions. In the case of exports.fail, it causes an infinite
// loop. Oops. So we use {...} to do a shallow copy instead.
module.exports = exports = { ...assert };

exports.equal = assert.strictEqual;

exports.throwsAsync = async function(fnAsync, expectedRegexOrExactString, message) {
	message = message ? `${message}: ` : "";
	try {
		await fnAsync();
	}
	catch (err) {
		if (expectedRegexOrExactString === undefined) return;
		if (typeof expectedRegexOrExactString === "string") {
			exports.equal(err.message, expectedRegexOrExactString, message);
		}
		else {
			exports.match(err.message, expectedRegexOrExactString, message);
		}
		return;
	}
	exports.fail(`${message}Expected exception`);
};

exports.doesNotThrowAsync = async function(fnAsync) {
	await fnAsync();
};