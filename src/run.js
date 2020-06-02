// Copyright Titanium I.T. LLC.
"use strict";

require("./rot13_server").create().startAsync().then((exitCode) => {
	process.exit(exitCode);
});
