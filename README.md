James Shore Live
================

This example code is used in my [Tuesday Lunch & Learn](https://www.jamesshore.com/v2/projects/lunch-and-learn) series. See that link for for more information and an archive of past episodes, or [watch live on Twitch](https://www.twitch.tv/jamesshorelive).


This Week's Challenge (4 Aug 2020): Nullable Output
---------------------

This week, we’re looking at nullable output. In the `src/infrastructure` directory, you'll find a CommandLine class. It's a nullable infrastructure wrapper for `stdout`. Briefly, this means that, if you use it to write to stdout in your production code, you can use CommandLine.createNull() in your tests to inject a version that is testable. For details, see the ["Testing Without Mocks" episode](http://www.jamesshore.com/v2/projects/lunch-and-learn/testing-without-mocks).

You can see an example of CommandLine being used in `src/countdown.js`. When you run the code (see "Running the Code", below), it will write one message per second to stdout. At the end, it will write the current time.

The tests for this code are in `src/_countdown_test.js`. CommandLine provides a `getLastStdout()` method that allows the tests to check what has been written to stdout. However, it only shows the contents of the last call to `commandLine.writeStdout()`.

Your challenge this week is to improve CommandLine so that you can test multiple calls to `commandLine.writeStdout()`. Be sure to do so in a way that doesn't result in a memory leak.

To demonstrate that you were successful, modify the countdown code so that it *doesn't* wait one second between writing the last message to stdout and writing the current time. This should require you to update the countdown tests to check the results of multiple calls to `commandLine.writeStdout()`.

Hints:

* The CommandLine code is in `src/infrastructure/command_line.js` and `src/infrastructure/_command_line_test.js`.
* The CommandLine tests use several helper files. You can safely ignore them.
* You can check for memory leaks by using the `checkForLeakAsync()` helper in `_command_line_test.js`.
* The Clock code isn't part of today's exercise, but if you'd like to learn more about how it works, see [the "International Dates and Times" episode](https://www.jamesshore.com/v2/projects/lunch-and-learn/international-dates-and-times).
* Make sure you're on Node.js version 14 or higher, as previous versions only include support for the US locale.


The Thinking Framework
----------------------

(Previous episodes may be helpful. You can find them [here](https://www.jamesshore.com/v2/projects/lunch-and-learn).)

The current code makes `commandLine.writeStdout(text)` testable by storing `text` in `this._lastStdout`. That works, although it's a bit clumsy. However, this approach can only remember the last call to `writeStdout()``. Now we want to keep track of multiple calls.

The naive solution is to change `this._lastStdout` to an array and push `text` onto the array after each call to `writeStdout()`. Although that will appear to work, it leaks memory. It's not a viable solution.

Instead, we need to keep track of calls to `writeStdout()` only when it matters, storing only as much as needed each time. The Observer pattern--events, in other words--is the perfect solution. If we emit an event each time `writeStdout()` is called, only code that needs to track writes will consume memory. The tests will listen for the event, push `text` onto an array, and then assert on the array.

To make the code easier to use, the event listening code can be abstracted. It's even possible to move it back into CommandLine without creating a memory leak. Fundamentally, though, the key to solving this week's challenge is to emit events when `writeStdout()` is called.

Tune in on August 4th at noon Pacific to see how I apply these ideas, including abstracting the tracking code back into CommandLine. For details, go to the [Lunch & Learn home page](https://www.jamesshore.com/v2/projects/lunch-and-learn). Starting August 5th, my solution will be archived on that page.


Running the Code
----------------

To run the code in this repository, install [Node.js](http://nodejs.org). Then:

* Run `./run.sh` to run the code manually.

* Run `./build.sh` to lint and test the code once, or `./watch.sh` to do so every time a file changes.

* Use `./build.sh quick` or `./watch.sh quick` to perform an incremental build, and `./clean.sh` to reset the incremental build.

* On Windows, use the .cmd versions: `run` instead of `./run.sh`, `watch` instead of `./watch.sh`, etc. If you are using gitbash, the .sh versions will also work, and they display the output better.

All commands must be run from the repository root.


License
-------

MIT License. See `LICENSE.txt`.