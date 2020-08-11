// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("../util/ensure");
const infrastructureHelper = require("../util/infrastructure_helper");
const EventEmitter = require("events");
const CommandLine = require("./command_line");
const Clock = require("./clock");

const OUTPUT_EVENT = "output";

/** Logging infrastructure */
const Log = module.exports = class Log {

	static create() {
		ensure.signature(arguments, []);
		return new Log(CommandLine.create(), Clock.create());
	}

	static createNull() {
		ensure.signature(arguments, []);
		return new Log(CommandLine.createNull(), Clock.createNull());
	}

	static get DEBUG() { return "debug"; }
	static get INFO() { return "info"; }
	static get MONITOR() { return "monitor"; }
	static get ACTION() { return "action"; }
	static get EMERGENCY() { return "emergency"; }

	constructor(commandLine, clock) {
		this._commandLine = commandLine;
		this._clock = clock;
		this._emitter = new EventEmitter();

		this.debug = logFn(this, Log.DEBUG);
		this.info = logFn(this, Log.INFO);
		this.monitor = logFn(this, Log.MONITOR);
		this.action = logFn(this, Log.ACTION);
		this.emergency = logFn(this, Log.EMERGENCY);
	}

	trackOutput() {
		ensure.signature(arguments, []);
		return infrastructureHelper.trackOutput(this._emitter, OUTPUT_EVENT);
	}

};

function logFn(self, alert) {
	return (data) => {
		doLog(self, alert, data);
	};
}

function doLog(self, alert, data) {
	ensure.signature(arguments, [ Log, String, Object ], [ "self", "alert", "data" ]);

	data = { alert, ...data };
	const { dataToLog, dataToTrack } = normalizeErrors(data);

	self._commandLine.writeStdout(`${(currentFormattedTime(self._clock))} ${JSON.stringify(dataToLog)}`);
	self._emitter.emit(OUTPUT_EVENT, dataToTrack);
}

function normalizeErrors(data) {
	const dataToLog = {};
	const dataToTrack = {};

	Object.entries(data).forEach(([name, value]) => {
		let logValue = value;
		let trackValue = value;
		if (value instanceof Error) {
			logValue = value.stack;
			trackValue = `${value.name}: ${value.message}`;
		}
		dataToLog[name] = logValue;
		dataToTrack[name] = trackValue;
	});

	return { dataToLog, dataToTrack };
}

function currentFormattedTime(clock) {
	const options = {
		dateStyle: "medium",
		timeStyle: "long",
		timeZone: "UTC",
		hourCycle: "h23",
	};
	return clock.toFormattedString(options, "en-US");
}
