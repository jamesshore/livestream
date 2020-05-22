// Copyright Titanium I.T. LLC.
"use strict";

const path = require("path");

const CommandLine = module.exports = class CommandLine {

	static get ERROR_CODE() {
		return {
			NONE: 0,
			BAD_COMMAND_LINE: 1,
		};
	}

	static create() {
		return new CommandLine();
	}

	args() {
		return process.argv.slice(2);
	}

	invokedCommand() {
		const node = path.basename(process.argv[0]);
		const script = path.basename(process.argv[1]);
		return `${node} ${script}`;
	}

	exitWithoutError() {
		process.exit((exports.ERROR_CODE = {
			NONE: 0,
			BAD_COMMAND_LINE: 1,
		}).NONE);
	}

	exitWithCommandLineError() {
		process.exit((exports.ERROR_CODE = {
			NONE: 0,
			BAD_COMMAND_LINE: 1,
		}).BAD_COMMAND_LINE);
	}

	writeOutput(text) {
		process.stdout.write(text);
	}

	writeError(text) {
		process.stderr.write(text);
	}

};
