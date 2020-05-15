// Copyright Titanium I.T. LLC.
"use strict";

const ERROR_CODE = exports.ERROR_CODE = {
	NONE: 0,
	BAD_COMMAND_LINE: 1,
};

exports.args = function() {
	return process.argv.slice(2);
};

exports.exitWithoutError = function() {
	process.exit(ERROR_CODE.NONE);
};

exports.exitWithCommandLineError = function() {
	process.exit(ERROR_CODE.BAD_COMMAND_LINE);
};

exports.writeOutput = function(text) {
	process.stdout.write(text);
};

exports.writeError = function(text) {
	process.stderr.write(text);
};

