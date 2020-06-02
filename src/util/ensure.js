// Copyright Titanium I.T. LLC. See LICENSE.txt for details.
"use strict";

const type = require("./type.js");

exports.that = function(variable, message) {
	if (message === undefined) message = "Expected condition to be true";

	if (variable === false) throw new Error(message);
	if (variable !== true) throw new Error("Expected condition to be true or false");
};

exports.unreachable = function(message) {
	if (!message) message = "Unreachable code executed";

	throw new Error(message);
};

exports.todo = function() {
	exports.unreachable("To-do code executed");
};

exports.defined = function(variable, variableName) {
	if (variable === undefined) throw new Error(normalize(variableName) + " was not defined");
};

exports.signature = function(args, signature, names) {
	signature = signature || [];
	names = names || [];
	exports.that(Array.isArray(signature), "ensure.signature(): signature parameter must be an array");
	exports.that(Array.isArray(names), "ensure.signature(): names parameter must be an array");

	const expectedArgCount = signature.length;
	const actualArgCount = args.length;

	if (actualArgCount > expectedArgCount) {
		throw new Error(`Function called with too many arguments: expected ${expectedArgCount} but got ${actualArgCount}`);
	}

	signature.forEach(function(expectedType, i) {
		const name = names[i] ? names[i] : "Argument #" + (i + 1);
		exports.type(args[i], expectedType, name);
	});
};

exports.signatureMinimum = function(args, signature, names) {
	checkSignature(args, signature, names, true);
};

exports.type = function(variable, expectedType, name) {
	checkType(variable, expectedType, false, name);
};

exports.typeMinimum = function(variable, expectedType, name) {
	checkType(variable, expectedType, true, name);
};

exports.boolean = checkTypeFn(Boolean);
exports.string = checkTypeFn(String);
exports.number = checkTypeFn(Number);
exports.array = checkTypeFn(Array);
exports.fn = checkTypeFn(Function);
exports.object = function(variable, constructor, variableName) {
	if (constructor === undefined) constructor = Object;
	exports.type(variable, constructor, variableName);
};

function checkSignature(args, signature, names, allowExtra) {
	signature = signature || [];
	names = names || [];
	exports.that(Array.isArray(signature), "ensure.signature(): signature parameter must be an array");
	exports.that(Array.isArray(names), "ensure.signature(): names parameter must be an array");

	const expectedArgCount = signature.length;
	const actualArgCount = args.length;

	if (!allowExtra && (actualArgCount > expectedArgCount)) {
		throw new Error(`Function called with too many arguments: expected ${expectedArgCount} but got ${actualArgCount}`);
	}

	signature.forEach(function(expectedType, i) {
		const name = names[i] ? names[i] : "Argument #" + (i + 1);
		const error = type.check(args[i], expectedType, { name, allowExtraKeys: allowExtra });
		if (error !== null) throw new Error(error);
	});
}

function checkType(variable, expectedType, allowExtraKeys, name) {
	if (name === undefined) name = "variable";
	const error = type.check(variable, expectedType, { name, allowExtraKeys });
	if (error !== null) throw new Error(error);
}

function checkTypeFn(type) {
	return function(variable, variableName) {
		exports.type(variable, type, variableName);
	};
}

function normalize(variableName) {
	return variableName ? variableName : "variable";
}
