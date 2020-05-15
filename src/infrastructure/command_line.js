// Copyright Titanium I.T. LLC.
"use strict";

exports.args = function() {
	return process.argv.slice(2);
};

exports.exitWithoutError = function() {
	process.exit(0);
};

exports.writeOutput = function(text) {
	process.stdout.write(text);
};

exports.writeError = function(text) {
	process.stderr.write(text);
};