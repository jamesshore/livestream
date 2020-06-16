// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("../util/ensure");

module.exports = class HttpRequest {

	static create(nodeRequest) {
		ensure.signature(arguments, [ Object ]);
		return new HttpRequest(nodeRequest);
	}

	constructor(nodeRequest) {
		this._request = nodeRequest;
	}

	get url() {
		return this._request.url;
	}

	get method() {
		return this._request.method;
	}

	get headers() {
		return { ...this._request.headers };
	}

	async readBodyAsync() {
		return await new Promise((resolve, reject) => {
			ensure.signature(arguments, []);
			if (this._request.readableEnded) return reject(new Error("Can't read request body because it's already been read"));

			let body = "";
			this._request.on("error", reject);    // this event is not tested
			this._request.on("data", (chunk) => {
				body += chunk;
			});
			this._request.on("end", () => {
				resolve(body);
			});
		});
	}

};