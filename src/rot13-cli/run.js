// Copyright Titanium I.T. LLC.
"use strict";

runAsync();

async function runAsync() {
	const start = Date.now();
	await require("./rot13_cli").runAsync();
	const elapsedMs = (Date.now() - start);
	console.log(`(${elapsedMs} ms)`);
}

