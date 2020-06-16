// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("./ensure");
const http = require("http");

exports.requestAsync = async function({ port, url, method, headers, body = [] } = {}) {
	return await new Promise((resolve, reject) => {
		ensure.signature(arguments, [[ undefined, {
			port: [ Number, String ],
			url: [ undefined, String ],
			method: [ undefined, String ],
			headers: [ undefined, Object ],
			body: [ undefined, Array ],
		}]]);
		if (method === undefined && body.length !== 0) method = "POST";

		const request = http.request({ port, path: url, method, headers });
		body.forEach((chunk) => request.write(chunk));
		request.end();

		request.on("response", (response) => {
			let body = "";
			response.on("data", (chunk) => {
				body += chunk;
			});
			response.on("error", (err) => reject(err));
			response.on("end", () => {
				const headers = response.headers;
				delete headers.connection;
				delete headers["content-length"];
				delete headers.date;

				resolve({
					status: response.statusCode,
					headers: response.headers,
					body,
				});
			});
		});
	});
};