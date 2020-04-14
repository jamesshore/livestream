// Copyright (c) 2013-2017 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
"use strict";

const semver = require("semver");

exports.check = function() {
	console.log("Checking Node.js version: .");

	const expectedVersion = require("../../package.json").engines.node;
	const actualVersion = process.version;

	if (semver.neq(actualVersion, expectedVersion)) {
		throw new Error(`Incorrect Node version. Expected ${expectedVersion}, but was ${actualVersion}.`);
	}

};


