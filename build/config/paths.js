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
		"spikes/**/*.js"
	], [
		"src/lets_code_javascript/www/v3/vendor/**/*.js",
		"src/lets_code_javascript/client/vendor_dev/**/*.js",
		"src/shared/vendor/**/*.js",
		"spikes/**/node_modules/**/*",
		"spikes/**/vendor/**/*"
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

exports.cmsTestFiles = memoize("cmsTestFiles", () => {
	return deglob([
		"src/_*_test.js",
		"src/server/**/_*_test.js",
		"src/shared/**/_*_test.js",
		"src/tools/**/_*_test.js",
	], [
		...exports.smokeTestFiles(),
	]);
});

exports.cmsTestDependencies = memoize("cmsTestDependencies", () => {
	return deglob([
		"src/*.js",
		"src/server/**/*.js",
		"src/shared/**/*.js",
		"src/tools/**/*.js",
		"src/lets_code_javascript/node_modules/lcjs_config.js",
		"src/lets_code_javascript/node_modules/lcjs_exchange.js",
	], [
			...exports.smokeTestFiles(),
		"src/server/run.js",
	]);
});

exports.lcjsSiteTestFiles = memoize("lcjsSiteTestFiles", () => {
	return deglob([
		"src/lets_code_javascript/**/_*_test.js"
	], [
		...exports.smokeTestFiles(),
		...exports.lcjsClientSideTestDependencies()
	]);
});

exports.lcjsSiteTestDependencies = memoize("lcjsSiteTestDependencies", () => {
	return deglob([
		"src/lets_code_javascript/**/*.js",
		"src/lets_code_javascript/**/*.jade",
		...exports.cmsTestDependencies(),
	], [
		...exports.smokeTestFiles(),
		...exports.cmsTestFiles(),
		...exports.lcjsClientSideTestDependencies(),
	]);
});

exports.jsSiteTestFiles = memoize("jsSiteTestFiles", () => {
	return deglob([
		"src/james_shore/**/_*_test.js",
	], [
		...exports.smokeTestFiles(),
	]);
});

exports.jsSiteTestDependencies = memoize("jsSiteTestDependencies", () => {
	return deglob([
		"src/james_shore/**/*.js",
		"src/james_shore/**/*.pug",
		...exports.cmsTestDependencies(),
	], [
		...exports.smokeTestFiles(),
		...exports.cmsTestFiles(),
	]);
});

exports.lcjsClientSideTestDependencies = memoize("lcjsClientSideTestDependencies", () => {
	return deglob([
		"src/lets_code_javascript/client/**/*.js",
		"src/shared/**/*.js"
	]);
});

exports.smokeTestFiles = memoize("smokeTestFiles", () => {
	return deglob([
		"src/**/_smoke_test.js",
		"src/_smoke_test_server.js",
	]);
});

exports.smokeTestDependencies = memoize("smokeTestDependencies", () => {
	return [
		...exports.smokeTestFiles(),
		"src/run.js",
		"src/master_server.js",
		"src/master_router.js",
		"src/server/globals.js",
		"src/server/cms/cms_server.js",
		"src/server/cms/http_server.js",
		"src/lets_code_javascript/node_modules/lcjs_router.js",
		"src/lets_code_javascript/node_modules/lcjs_config.js",
		"src/lets_code_javascript/node_modules/production_episodes.js",
		"src/james_shore/node_modules/js_router.js",
	];
});

exports.lcjsCssFile = memoize("lcjsCssFile", () => {
	// Be sure to update master template if CSS file location changes
	return "src/lets_code_javascript/www/v3/css/screen.css";
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