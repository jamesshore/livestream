// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("util/ensure");
const rot13 = require("./logic/rot13");

/** Top-level 'traffic cop' for ROT-13 service */
exports.transformAsync = async function(text) {
	ensure.signature(arguments, [ String ]);
	return await rot13.transform(text);
};
