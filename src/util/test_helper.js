// Copyright Titanium I.T. LLC.
"use strict";

const childProcess = require("child_process");
const path = require("path");

exports.runModuleAsync = function(baseDir, modulePath, { args, failOnError = true } = {}) {
	return new Promise((resolve, reject) => {
		const absolutePath = path.resolve(baseDir, modulePath);
		const options = {
			stdio: "pipe",
		};
		const child = childProcess.fork(absolutePath, args, options);

		let stdout = "";
		let stderr = "";
		child.stdout.on("data", (data) => {
			stdout += data;
		});
		child.stderr.on("data", (data) => {
			stderr += data;
		});

		child.on("exit", (code) => {
			if (failOnError && stderr !== "") {
				console.log(stderr);
				return reject(new Error("Runner failed"));
			}
			else {
				return resolve({ code, stdout, stderr });
			}
		});
	});
};
