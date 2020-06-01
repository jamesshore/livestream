// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert");

describe("Assert", function() {

	describe("throwsAsync()", function() {

		it("passes if function throws and there's no expectation", async function() {
			await expectPassAsync(async () => {
				await assert.throwsAsync(() => { throw new Error("any error"); });
			});
		});

		it("passes if function throws and error message matches expected string", async function() {
			await expectPassAsync(async () => {
				await assert.throwsAsync(
					() => { throw new Error("my error"); },
					"my error"
				);
			});
		});

		it("passes if function throws and error message matches regex", async function() {
			await expectPassAsync(async () => {
				await assert.throwsAsync(
					() => { throw new Error("my complicated error message"); },
					/complicated/
				);
			});
		});

		it("fails if function doesn't throw", async function() {
			await expectFailAsync(async () => {
				await assert.throwsAsync(() => {});
			}, "Expected exception");
		});

		it("fails if function throws and error message doesn't match expected string", async function() {
			await expectFailAsync(async () => {
				await assert.throwsAsync(
					() => { throw new Error("my error"); },
					"not my error"
				);
			}, "expected 'my error' to equal 'not my error'");
		});

		it("passes if function throws and error message doesn't match regex", async function() {
			await expectFailAsync(async () => {
				await assert.throwsAsync(
					() => { throw new Error("my complicated error message"); },
					/not-found/
				);
			}, "expected 'my complicated error message' to match /not-found/");
		});

	});

});

async function expectPassAsync(fnAsync) {
	await fnAsync();
}

async function expectFailAsync(fnAsync, expectedFailureMessage) {
	try {
		await fnAsync();
	}
	catch (err) {
		assert.equal(err.message, expectedFailureMessage);
	}
}