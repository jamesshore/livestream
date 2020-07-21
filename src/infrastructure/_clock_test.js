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

	it("outputs current time using computer's language and time zone", function() {
		const format = {
			dateStyle: "medium",
			timeStyle: "short",
		};
		checkToFormattedString(format);
	});

	it("outputs current time using configured time zone and locale", function() {
		const format = {
			timeZone: "Europe/Paris",
			dateStyle: "medium",
			timeStyle: "short",
		};
		const locale = "fr";
		checkToFormattedString(format, locale);
	});

	function checkToFormattedString(format, locale) {
		const clock = Clock.create();
		let expected = new Date().toLocaleString(locale, format);
		const actual = clock.toFormattedString(format, locale);
		if (expected !== actual) expected = new Date().toLocaleString(locale, format);

		assert.equal(actual, expected);
	}

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

		it("renders to formatted string", function() {
			const clock = Clock.createNull({ now: 0 });

			const format = {
				timeZone: "Europe/Paris",
				dateStyle: "medium",
				timeStyle: "short",
			};
			assert.equal(clock.toFormattedString(format, "fr"), "1 janv. 1970 à 01:00");
		});

		it("defaults time zone and locale to UTC and France", function() {
			const clock = Clock.createNull({ now: 0 });
			const format = { dateStyle: "medium", timeStyle: "long" };
			assert.equal(clock.toFormattedString(format), "1 janv. 1970 à 00:00:00 UTC");
			assert.deepEqual(format, { dateStyle: "medium", timeStyle: "long" }, "should not modify original format object");
		});

		it("allows local time zone to be configured", function() {
			const clock = Clock.createNull({ now: 0, timeZone: "America/New_York", locale: "uk" });
			const format = { dateStyle: "medium", timeStyle: "long" };
			assert.equal(clock.toFormattedString(format), "31 груд. 1969 р., 19:00:00 GMT-5");
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