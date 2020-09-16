#!/usr/local/bin/node

// Automatically runs build when files change.
//
// Thanks to Davide Alberto Molin for inspiring this code.
// See https://www.letscodejavascript.com/v3/comments/live/7 for details.

"use strict";

const build = require("./build");
const gaze = require("gaze");
const pathLib = require("path");
const sh = require("../util/sh");

const BUILD_FILES = [
	"build/**/*",
];
const SOURCE_FILES = [
	"src/**/*",
];
const RESTART_WHEN_MEMORY_USAGE_EXCEEDS_MIB = 256;

const args = process.argv.slice(2);
let buildRunning = false;
let buildQueued = false;
let buildStartedAt;

gaze(BUILD_FILES, (err, watcher) => {
	if (err) {
		console.log("WATCH ERROR:", err);
		return;
	}
	watcher.on("all", () => {
		console.log("*** Build files changed");
		restart();
	});
});

gaze(SOURCE_FILES, function(err, watcher) {
	if (err) {
		console.log("WATCH ERROR:", err);
		return;
	}
	console.log(`Watching ${SOURCE_FILES.join(", ")}`);

	watcher.on("changed", triggerBuild.bind(null, "changed"));
	watcher.on("deleted", cleanAndRestart.bind(null, "deleted"));
	watcher.on("added", restart.bind(null, "added"));
	triggerBuild();    // Always run after startup
});


async function triggerBuild(event, filepath) {
	try {
		logEvent(event, filepath);
		if (!buildRunning) await runBuild();
		else queueAnotherBuild();
	}
	catch (err) {
		console.log(err);
	}
}

async function runBuild() {
	if (process.memoryUsage().rss > RESTART_WHEN_MEMORY_USAGE_EXCEEDS_MIB * 1024 * 1024) {
		process.stdout.write(`Memory usage exceeds ${RESTART_WHEN_MEMORY_USAGE_EXCEEDS_MIB} MiB: `);
		restart();
	}

	do {
		buildQueued = false;
		buildRunning = true;
		buildStartedAt = Date.now();
		console.log(`\n\n\n\n*** BUILD> ${args.join(" ")}`);

		global.buildStart = Date.now();

		const buildResult = await build.runAsync(args);
		alertBuildResult(buildResult);

		flushCaches();
		buildRunning = false;
	} while (buildQueued);
}

function queueAnotherBuild() {
	if (buildQueued) return;
	if (debounce()) return;

	console.log("*** Build queued");
	buildQueued = true;

	function debounce() {
		const msSinceLastBuild = Date.now() - buildStartedAt;
		return msSinceLastBuild < 100;
	}
}

function alertBuildResult(buildResult) {
	if (buildResult === null) {
		playSoundAsync("../sounds/success.wav");
	}
	else if (buildResult === "lint") {
		playSoundAsync("../sounds/lint_error.wav");
	}
	else {
		playSoundAsync("../sounds/fail.wav");
	}
}

function flushCaches() {
	Object.keys(require.cache).forEach((key) => {
		const srcDirPrefix = pathLib.resolve("./src") + pathLib.sep;
		const nodeModulesPrefix = pathLib.resolve("./node_modules") + pathLib.sep;

		if (key.startsWith(srcDirPrefix) || key.startsWith(nodeModulesPrefix)) delete require.cache[key];
	});
}

async function cleanAndRestart(event, filepath) {
	await build.runAsync([ "clean" ]);
	restart();
}

function restart(event, filepath) {
	if (event !== undefined) logEvent(event, filepath);
	process.exit(0);
	// watch.sh will detect that process exited cleanly and restart it
}

function logEvent(event, filepath) {
	if (filepath === undefined) return;

	const truncatedPath = pathLib.basename(pathLib.dirname(filepath)) + "/" + pathLib.basename(filepath);
	console.log(`*** ${event.toUpperCase()}: ${truncatedPath}`);
}

async function playSoundAsync(filename) {
	try {
		const path = pathLib.resolve(__dirname, filename);
		if(process.platform === 'win32'){
			// If on Windows create a Media.SoundPlayer .Net object to play the sound, it is invoked through powershell
			// note that Media.SoundPlayer has a restriction of only working on .wav files.
			await sh.runSilentlyAsync(`powershell`,['-c',`(New-Object Media.SoundPlayer "${path}").PlaySync();`]);
    } else if (process.platform === 'linux'){
      // aplay is part of the alsa-utils package
      await sh.runSilentlyAsync("aplay", [ path ]);
		} else {
			// Designed for MacOS, which has built-in 'afplay' command
			await sh.runSilentlyAsync("afplay", [ path ]);
		}
	}
	catch (err) {
		// If audio player isn't found, just ignore it
	}
}
