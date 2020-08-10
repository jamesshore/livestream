// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("../util/assert");
const Clock = require("./clock");

describe("Clock", function() {

	it("provides current timestamp", function() {
		const clock = Clock.create();

		// Don't inline because that results in a race condition between actual and expected.
		let expected = Date.now();
		const actual = clock.now();
		if (actual !== expected) expected = Date.now();
		assert.equal(actual, expected);
	});

	it("waits N milliseconds", async function() {
		const clock = Clock.create();

		const start = clock.now();
		await clock.waitAsync(10);
		const elapsedTime = clock.now() - start;
		assert.isAtLeast(elapsedTime, 9);
	});


	describe("formatting", function() {

		it("outputs current time using computer's language and time zone", function() {
			const format = {
				dateStyle: "medium",
				timeStyle: "short",
				timeZone: "local",
			};
			const formatCopy = { ...format };
			const jsFormat = {
				dateStyle: "medium",
				timeStyle: "short",
			};

			checkToFormattedString(format, jsFormat, "local", undefined);
			assert.deepEqual(format, formatCopy, "should not modify original format object");
		});

		it("outputs current time using configured time zone and locale", function() {
			const format = {
				timeZone: "Europe/Paris",
				dateStyle: "medium",
				timeStyle: "short",
			};
			const locale = "fr";
			checkToFormattedString(format, format, locale, locale);
		});

		it("fails fast if time zone isn't specified", function() {
			assert.throws(
				() => Clock.create().toFormattedString({}, "en-US"),
				"Must specify options.timeZone (use 'local' for computer's time zone)"
			);
		});

		it("fails fast if locale isn't specified", function() {
			assert.throws(
				() => Clock.create().toFormattedString({ timeZone: "UTC" }),
				"Must specify locale (use 'local' for computer's default locale)"
			);
		});

		function checkToFormattedString(ourFormat, jsFormat, ourLocale, jsLocale) {
			const clock = Clock.create();
			let expected = new Date().toLocaleString(jsLocale, jsFormat);
			const actual = clock.toFormattedString(ourFormat, ourLocale);
			if (expected !== actual) expected = new Date().toLocaleString(jsLocale, jsFormat);

			assert.equal(actual, expected);
		}

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

		it("defaults time zone and locale to little-used values to prevent false successes", function() {
			const clock = Clock.createNull({ now: 0 });
			const format = { dateStyle: "medium", timeStyle: "long", timeZone: "local" };
			const formatCopy = { ...format };

			assert.equal(clock.toFormattedString(format, "local"), "1970 J-guer 1 10:00:00 GMT+10");
			assert.deepEqual(format, formatCopy, "should not modify original format object");
		});

		it("allows local time zone and locale to be configured", function() {
			const clock = Clock.createNull({ now: 0, timeZone: "America/New_York", locale: "uk" });
			const format = { dateStyle: "medium", timeStyle: "long", timeZone: "local" };
			assert.equal(clock.toFormattedString(format, "local"), "31 груд. 1969 р., 19:00:00 GMT-5");
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