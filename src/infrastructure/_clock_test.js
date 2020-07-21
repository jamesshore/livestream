// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("../util/assert");
const Clock = require("./clock");

describe("Clock", function() {

	it("provides current timestamp", function() {
		const clock = Clock.create();

		// Don't inline because that results in a race condition between actual and expected.
		const actual = clock.now();
		const expected = Date.now();
		assert.isAtLeast(actual, expected);
	});

	it("waits N milliseconds", async function() {
		const clock = Clock.create();

		const start = clock.now();
		await clock.waitAsync(10);
		const elapsedTime = clock.now() - start;
		assert.isAtLeast(elapsedTime, 9);
	});


	describe("nullability", function() {

		it("defaults 'now' to zero", function() {
			const clock = Clock.createNull();
			assert.equal(clock.now(), 0);
		});

		it("allows 'now' to be configured", function() {
			const clock = Clock.createNull({ now: 42 });
			assert.equal(clock.now(), 42);
		});

		it("can advance the clock", async function() {
			const clock = Clock.createNull();
			await clock.advanceNullAsync(10);
			assert.equal(clock.now(), 10);
		});

		it("fails fast when attempting to advance the system clock", async function() {
			const clock = Clock.create();
			await assert.throwsAsync(
				() => clock.advanceNullAsync(10),
				"Can't advance the clock because it isn't a null clock"
			);
		});

		it("can wait", async function() {
			const clock = Clock.createNull();
			let wait = "waiting";

			clock.waitAsync(10).then(() => {
				wait = clock.now();
			});
			assert.equal(wait, "waiting");
			await clock.advanceNullAsync(20);
			assert.equal(wait, 10);
		});

	});

});