// Copyright Titanium I.T. LLC.
"use strict";

exports.args = function() {
	return process.argv.slice(2);
};

exports.writeOutput = function(text) {
	console.log(text);
};