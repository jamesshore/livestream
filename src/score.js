// Copyright Titanium I.T. LLC.
"use strict";

const App = require("./app.js");

const app = App.create();
const exitCode = app.run();

process.exit(exitCode);

