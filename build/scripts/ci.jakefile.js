// Copyright Titanium I.T. LLC. All rights reserved.
/*global desc, task, jake, fail, complete */

"use strict";

const https = require("https");
const shUtil = require("../util/sh.js");

const PRODUCTION_APP = "heroku";
const APP = process.env.app || PRODUCTION_APP;

const UNIX_BUILD = [ "./build.sh" ];
const NODE_SECURITY_CHECK = [ "npm", "audit" ];

const PRODUCTION_URL = "https://www.letscodejavascript.com";
const SMOKE_TEST_MARKER = "Let's Code JavaScript home page";
const INTEGRATION_BRANCH = "integration";
const DEV_BRANCH = "dev";

const DEPLOY_COMMAND = [ "git", "push", APP, `${INTEGRATION_BRANCH}:master` ];
const ROLLBACK_COMMAND = [ "heroku", "rollback", "--app", "letscodejavascript" ];

const startTime = Date.now();

let noSecurity = process.env.noSecurity || "false";
noSecurity = parseBoolean("noSecurity", noSecurity);

desc("Quick reference");
task("default", function() {
	console.log(
		"Integration quick reference:\n" +
		"   1. Confirm good build and commit\n" +
		"   2. On integration machine: `./ci.sh release`\n" +
		"\n" +
		"To deploy to different Heroku app (for staging, for example):\n" +
		"   `./ci.sh release app=[name]`\n"
	);
});

desc("Deploy code to Heroku (Run on CI machine!)");
task("release", ["integrate"], async function() {
	// NOTE: There's a race condition in this task: there's a small window between the
	// deploy command completing and the server being restarted, so sometimes the smoke test
	// is run against the *old* server, not the one that's just been deployed. I've hacked
	// around the issue for now by just adding a 2-second delay. (Yuck!) A true fix
	// requires monitoring the Heroku logs for 'Server started' before running the smoke
	// test, or something similar.

	try {
		await execAsync(DEPLOY_COMMAND);
	}
	catch (err) {
		await twoSecondDelayAsync();
		const isOnline = await smokeTestAsync();
		if (isOnline) fail("Deploy failed, but application is online.");
		else fail("Deploy failed. APPLICATION OFFLINE! Run rollback target.");
		return;
	}

	await twoSecondDelayAsync();
	console.log("Smoke testing production release...");
	const isOnline = await smokeTestAsync();
	if (isOnline) {
		console.log(`Smoke test passed. Application successfully deployed to ${APP}.`);
		console.log("Tagging release...");
		await tagCommitAsync(APP, INTEGRATION_BRANCH);
		try {
			await execAsync("git", "push", "--tags");
		}
		catch (err) {
			console.log("Failed to push tags");
		}

		const elapsedTime = (Date.now() - startTime) / 1000;
		console.log("\n\n--++===>>>[ RELEASE OK ]<<<===++--  (" + elapsedTime.toFixed(2) +  "s)");
	}
	else {
		fail("Smoke test failed. APPLICATION OFFLINE! Run rollback target.");
	}
});

desc("Rollback to previous release");
task("rollback", async function() {
	try {
		await execAsync(ROLLBACK_COMMAND);
	}
	catch (err) {
		await twoSecondDelayAsync();
		console.log("Rollback failed. Smoke testing release...");
		const isOnline = await smokeTestAsync();
		if (isOnline) fail("Rollback failed, but application is online.");
		else fail("APPLICATION STILL OFFLINE! Fix manually.");
	}

	await twoSecondDelayAsync();
	console.log("Rollback complete. Smoke testing release...");
	const isOnline = await smokeTestAsync();
	if (isOnline) console.log("Application online.");
	else fail("APPLICATION STILL OFFLINE! Fix manually.");
});

desc("Check if release is online");
task("smoketest", async function() {
	console.log("Smoke testing release...");
	const passed = await smokeTestAsync();
	if (passed) console.log("Application online.");
	else fail("APPLICATION OFFLINE!");
});

desc("Promote code to integration branch (Run on CI machine!)");
task("integrate", [ "pull", "validate" ], async function() {
	try {
		await execAsync("git", "checkout", INTEGRATION_BRANCH);
		const { code } = await shUtil.runInteractive(
			"git", ["merge", DEV_BRANCH, "--no-ff", "--log=500", "-m", "INTEGRATE:", "--edit"]
		);
		if (code !== 0) fail("Merge failed");
		await execAsync("git", "push");
		await execAsync("git", "checkout", DEV_BRANCH);
	}
	catch (err) {
		await resetRepoAsync();
		throw err;
	}

	async function resetRepoAsync() {
		console.log("Resetting repository");
		await execAsync("git", "reset", "--hard");
		await execAsync("git", "checkout", DEV_BRANCH);
	}
});

desc("Ensure the code is ready to release");
task("validate", [ "checked_in", "npm_rebuild", "npm_install", "security_check", "build" ], async function() {
	// The npm_install task changes files. We want our validation to check those changes, but
	// then we need to undo it so the next integration doesn't have merge conflicts.
	await execAsync("git", "reset", "--hard");
	await execAsync("git", "clean", "-fdx");
});

task("security_check", async function() {
	if (noSecurity) {
		console.log("WARNING: Skipping security check.");
		return;
	}

	try {
		await execAsync(NODE_SECURITY_CHECK);
	}
	catch (err) {
		fail("Security check failed; use noSecurity=true to suppress (use with caution!)");
	}
});

task("build", async function() {
	await execAsync(UNIX_BUILD);
});

task("checked_in", async function() {
	await checkGitStatusAsync("Can't validate until all files are checked in or ignored");
});

task("pull", async function() {
	await checkGitStatusAsync("Integration box isn't clean");
	try {
		await execAsync("git", "checkout", INTEGRATION_BRANCH);
		await execAsync("git", "pull");
		await execAsync("git", "checkout", DEV_BRANCH);
		await execAsync("git", "pull");
		await execAsync("git", "clean", "-fdx");
	}
	catch (err) {
		await execAsync("git", "checkout", DEV_BRANCH);
		fail("Only integrate on integration machine!");
	}
});

task("npm_rebuild", async function() {
	await execAsync("npm", "rebuild");
	await checkGitStatusAsync("Need to ignore NPM build files");
});

task("npm_install", async function() {
	// Heroku runs `npm install` and that can change installed files, so we check it here
	await execAsync("npm", "install", "--no-audit");
	// Heroku prunes devDependencies, so we check that here
	await execAsync("npm", "prune", "--production", "--no-audit");
});

async function checkGitStatusAsync(errorMessage) {
	const stdout = await execAsync("git", "status", "--porcelain");
	if (stdout[0]) fail(errorMessage);
}

function smokeTestAsync() {
	return new Promise((resolve, reject) => {
		const request = https.get(PRODUCTION_URL);
		request.on("response", function(response) {
			let data = "";
			response.setEncoding("utf8");

			response.on("data", function(chunk) {
				data += chunk;
			});
			response.on("end", function() {
				const foundMarker = data.indexOf(SMOKE_TEST_MARKER) !== -1;
				resolve(foundMarker);
			});
			response.on("error", reject);
		});
		request.on("error", reject);
	});
}

async function tagCommitAsync(destination, commitToTag) {
	if (destination !== PRODUCTION_APP) {
		console.log(
			`Repository not tagged. (Production app is ${PRODUCTION_APP}, but this deploy was to ${destination}.)`
		);
		return;
	}

	try {
		const now = new Date();
		await execAsync("git", "tag", "-a", tagName(now), "-m", tagMessage(now), commitToTag);
	}
	catch (err) {
		throw new Error("Application deployed and online, but failed to tag repository.");
	}

	function tagName(date) {
		const humanReadableDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
		const timestamp = date.getTime();
		return `deploy-${humanReadableDate}-${timestamp}`;
	}

	function tagMessage(date) {
		return `Application successfully deployed to ${destination} at ${date.toUTCString()}\n` +
			`Local time: ${date.toLocaleString("en-US", { timeZoneName: "short" })}`;
	}
}

async function execAsync(command, ...args) {
	if (Array.isArray(command)) [ command, ...args ] = command;

	const { code, stdout } = await shUtil.runAsync(command, args);
	if (code !== 0) throw new Error("shell command exited with error code");
	return stdout;
}

function parseBoolean(name, val) {
	val = val.toLowerCase();
	if (val === "true") return true;
	if (val === "false") return false;
	throw new Error("Expected '" + name + "' to be 'true' or 'false'");
}

function twoSecondDelayAsync(fn) {
	console.log("Pausing so deploy can take effect...");
	return new Promise((resolve, reject) => setTimeout(resolve, 2000));
}
