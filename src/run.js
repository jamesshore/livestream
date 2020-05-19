// Copyright Titanium I.T. LLC.
"use strict";

const commandLine = require("./infrastructure/command_line").create();
const rot13 = require("./logic/rot13").create();
const App = require("./app");

App.create(commandLine, rot13).run();