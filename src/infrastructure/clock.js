// Copyright Titanium I.T. LLC.
"use strict";

const FakeTimers = require("@sinonjs/fake-timers");

module.exports = class Clock {

	static create() {
		return new Clock({
			Date,
			DateTimeFormat: Intl.DateTimeFormat,
			setTimeout,
			advanceNullAsync() { throw new Error("Can't advance the clock because it isn't a null clock"); }
		});
	}

	static createNull(options) {
		return new Clock(nullGlobals(options));
	}

	constructor(globals) {
		this._globals = globals;
	}

	now() {
		return this._globals.Date.now();
	}

	toFormattedString(intlDateTimeFormatOptions, locale) {
		if (intlDateTimeFormatOptions.timeZone === undefined) {
			throw new Error("Must specify options.timeZone (use 'local' for computer's time zone)");
		}
		if (locale === undefined) {
			throw new Error("Must specify locale (use 'local' for computer's default locale)");
		}

		const options = { ...intlDateTimeFormatOptions };
		if (options.timeZone === "local") delete options.timeZone;
		if (locale === "local") locale = undefined;

		const now = new this._globals.Date();
		const formatter = this._globals.DateTimeFormat(locale, options);
		return formatter.format(now);
	}

	async advanceNullAsync(milliseconds) {
		await this._globals.advanceNullAsync(milliseconds);
	}

	async waitAsync(milliseconds) {
		await new Promise((resolve) => {
			this._globals.setTimeout(() => resolve(), milliseconds);
		});
	}

};


function nullGlobals({
	now = 0,
	locale = "gv-GB",
	timeZone = "Australia/Lord_Howe"
} = {}) {
	const fake = FakeTimers.createClock(now);

	return {
		Date: fake.Date,

		DateTimeFormat(locales, options) {
			if (locales === undefined) locales = locale;
			options = { timeZone, ...options };
			return Intl.DateTimeFormat(locales, options);
		},

		async advanceNullAsync(milliseconds) {
			await fake.tickAsync(milliseconds);
		},

		setTimeout(fn, milliseconds) {
			return fake.setTimeout(fn, milliseconds);
		}
	};

}