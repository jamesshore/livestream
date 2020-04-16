// Copyright (c) 2015-2018 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

const glob = require("glob");
const path = require("path");

exports.generatedDir = "generated";
exports.tempTestfileDir = `${exports.generatedDir}/test`;
exports.incrementalDir = `${exports.generatedDir}/incremental`;

exports.lintFiles = memoize("lintFiles", () => {
	return deglob([
		"*.js",
		"build/**/*.js",
		"src/**/*.js",
	], [
	]);
});

exports.lintOutput = memoize("lintOutput", () => {
	return exports.lintFiles().map(function(pathname) {
		return `${exports.incrementalDir}/lint/${pathname}.lint`;
	});
});

exports.lintDirectories = memoize("lintDirectories", () => {
	return exports.lintOutput().map(function(lintDependency) {
		return path.dirname(lintDependency);
	});
});

exports.testDependencies = memoize("testDependencies", () => {
	return deglob([
		"src/**/*.js",
		"src/**/*.css",
	], [
	]);
});

exports.lcjsCssDependencies = memoize("lcjsCssDependencies", () => {
	return deglob("src/lets_code_javascript/client/sass/**/*.scss");
});

const deglob = exports.deglob = function(patternsToFind, patternsToIgnore) {
	let globPattern = patternsToFind;
	if (Array.isArray(patternsToFind)) {
		if (patternsToFind.length === 1) {
			globPattern = patternsToFind[0];
		}
		else {
			globPattern = "{" + patternsToFind.join(",") + "}";
		}
	}

	return glob.sync(globPattern, { ignore: patternsToIgnore });
};


// Cache function results for performance
function memoize(name, fn) {
	let cache;
	return function() {
		if (cache === undefined) {
			cache = fn();
		}
		return cache;
	};
}