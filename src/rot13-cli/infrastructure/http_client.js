// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("util/ensure");
const http = require("http");

/** Generic HTTP client */
module.exports = class HttpClient {

	static create() {
		return new HttpClient();
	}

	async requestAsync({ host, port, method, path, headers, body }) {
		ensure.signature(arguments, [{
			host: String,
			port: Number,
			method: String,
			path: String,
			headers: [ undefined, Object ],
			body: [ undefined, String ],
		}]);

		return await new Promise((resolve, reject) => {
			const request = http.request({
				host,
				port,
				method,
				path,
				headers,
			});
			request.end(body);

			request.on("response", (response) => {
				response.resume();

				const headers = { ...response.headers };
				delete headers.connection;
				delete headers["content-length"];
				delete headers.date;

				let body = "";
				response.on("data", (chunk) => {
					body += chunk;
				});
				response.on("end", () => {
					resolve({
						status: response.statusCode,
						headers,
						body,
					});
				});
			});
		});
	}

};