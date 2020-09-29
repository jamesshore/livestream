// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("util/ensure");
const Rot13Server = require("../../rot13-service/rot13_server");

/** ROT-13 service client */
module.exports = class Rot13Client {

	static create() {
		ensure.signature(arguments, []);
		return new Rot13Client();
	}

	async transformAsync(text) {
		ensure.signature(arguments, [ String ]);
		return await Rot13Server.transformAsync(text);
	}

};
