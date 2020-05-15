// Copyright Titanium I.T. LLC.
"use strict";

const path = require("path");

const ERROR_CODE = exports.ERROR_CODE = {
	NONE: 0,
	BAD_COMMAND_LINE: 1,
};

exports.args = function() {
	return process.argv.slice(2);
};

exports.invokedCommand = function() {
	const node = path.basename(process.argv[0]);
	const script = path.basename(process.argv[1]);
	return `${node} ${script}`;
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

