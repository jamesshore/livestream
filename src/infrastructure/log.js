// Copyright Titanium I.T. LLC.
"use strict";

const infrastructureHelper = require("../util/infrastructure_helper");
const EventEmitter = require("events");
const CommandLine = require("./command_line");
const Clock = require("./clock");

const OUTPUT_EVENT = "output";

module.exports = class Log {

	static create() {
		return new Log(CommandLine.create(), Clock.create());
	}

	static createNull() {
		return new Log(CommandLine.createNull(), Clock.createNull());
	}

	constructor(commandLine, clock) {
		this._commandLine = commandLine;
		this._clock = clock;
		this._emitter = new EventEmitter();

		this.debug = logFn(this, "debug");
		this.info = logFn(this, "info");
		this.monitor = logFn(this, "monitor");
		this.action = logFn(this, "action");
		this.emergency = logFn(this, "emergency");
	}

	trackOutput() {
		return infrastructureHelper.trackOutput(this._emitter, OUTPUT_EVENT);
	}

};

function logFn(self, alert) {
	return (data) => {
		doLog(self, alert, data);
	};
}

function doLog(self, alert, data) {
	data = { alert, ...data };

	const output = {};
	const emit = {};
	Object.entries(data).forEach(([name, value]) => {
		let outputValue = value;
		let emitValue = value;
		if (value instanceof Error) {
			outputValue = value.stack;
			emitValue = `${value.name}: ${value.message}`;
		}
		output[name] = outputValue;
		emit[name] = emitValue;
	});

	const options = {
		dateStyle: "medium",
		timeStyle: "long",
		timeZone: "UTC",
		hourCycle: "h23",
	};
	const time = self._clock.toFormattedString(options, "en-US");
	self._commandLine.writeStdout(`${time} ${JSON.stringify(output)}`);
	self._emitter.emit(OUTPUT_EVENT, emit);
}
