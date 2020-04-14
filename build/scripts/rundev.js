#!/usr/local/bin/node

// Automatically runs Jake when files change.
//
// Thanks to Davide Alberto Molin for contributing this code.
// See https://www.letscodejavascript.com/v3/comments/live/7 for details.
//
// NOTE: The "COMMAND" variable must be changed for this to work on Windows.

"use strict";

const gaze = require("gaze");
const spawn = require("child_process").spawn;

const WATCH = "src/**/*";

const COMMAND = "node";
const COMMAND_ARGS = ["src/run.js", "5000"];

let child;

gaze(WATCH, function(err, watcher) {
	console.log("Will restart server when " + WATCH + " changes.");
	run();
	watcher.on("all", function(evt, filepath) {
		console.log(filepath + " changed");
		kill(run);
	});
});

function run() {
	if (child) return;

	console.log("\n> " + COMMAND + " " + COMMAND_ARGS.join(" "));
	child = spawn(COMMAND, COMMAND_ARGS, { stdio: "inherit" });
	child.on("exit", function() {
		child = null;
	});
}

function kill(callback) {
	if (!child) return callback();

	console.log("\n> kill " + COMMAND);
	child.kill();
	child.on("exit", callback);
}
