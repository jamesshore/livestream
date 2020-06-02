// Copyright Titanium I.T. LLC.
"use strict";

require("./server").create().startAsync().then((exitCode) => {
	process.exit(exitCode);
});
