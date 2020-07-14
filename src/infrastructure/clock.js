// Copyright Titanium I.T. LLC.
"use strict";

const FakeTimers = require("@sinonjs/fake-timers");

module.exports = class Clock {

	static create() {
		return new Clock({
			Date,
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

	async advanceNullAsync(milliseconds) {
		await this._globals.advanceNullAsync(milliseconds);
	}

	async waitAsync(milliseconds) {
		await new Promise((resolve) => {
			this._globals.setTimeout(() => resolve(), milliseconds);
		});
	}

};


function nullGlobals({ now = 0 } = {}) {
	const fake = FakeTimers.createClock(now);

	return {
		Date: fake.Date,

		async advanceNullAsync(milliseconds) {
			await fake.tickAsync(milliseconds);
		},

		setTimeout(fn, milliseconds) {
			return fake.setTimeout(fn, milliseconds);
		}
	};

}