James Shore Live
================

This example code is used in my [Tuesday Lunch & Learn](https://www.jamesshore.com/Blog/Lunch-and-Learn/) series. See that link for for more information and an archive of past episodes, or [watch live on Twitch](https://www.twitch.tv/jamesshorelive).


This Week's Challenge (14 July 2020): No More Flaky Clock Tests
---------------------

This week, your task is to implement a simple countdown. Given an array of strings, `countdown.js` should display one line of the array every second. In other words, given `["3", "2", "1"]`, your code should output "3\n", wait one second, output "2\n", wait one second, and then output "1\n".

The challenge here isn't the countdown; it's testing the code. Your tests need to be fast and reliable.

Tune in on July 14th at noon Pacific to see my solution. For details, go to the [Lunch & Learn home page](https://www.jamesshore.com/Blog/Lunch-and-Learn/).

Hints:

* `src/run.js` is the entry point for the code. You won't need to edit this file.
* `src/countdown.js` and `src/_countdown_test.js` are the application code you'll need to edit. They're just stubbed in at the moment.
* You'll probably want to use `src/infrastructure/command_line.js` to make it easier to test `stdout`.
* `src/util/assert.js` has assertions. It's a wrapper around [Chai's assert module](https://www.chaijs.com/api/assert/).
* The [@sinonjs/fake-timers](https://github.com/sinonjs/fake-timers) npm module is vendored into the repo. You can use it with `require("@sinonjs/fake-timers")`.


The Thinking Framework
----------------------

(Previous episodes may be helpful. You can find them [here](https://www.jamesshore.com/Blog/Lunch-and-Learn/).)

Clock-based tests are often slow and flaky: they fail randomly. This is for several reasons:

1. When testing production code that has timeouts, the tests are written to wait for the timeout. This slows down the test suite.
2. Computation time is non-deterministic. Sometimes an operation that is supposed to take less than 3ms takes 5ms, or 10ms, resulting in a test failure.
3. Assumptions that are true today aren't always true tomorrow. For example, a test might be written under the assumption that the current month has 30 or 31 days. It works fine until February rolls around.

To prevent these issues, control the clock.

1. Don't wait for timeouts in your tests. Instead, force the timeout to occur when you want it.
2. Rather than computing elapsed time, tell the clock that a specific amount of time has elapsed.
3. When testing production code that uses the current time, predefine the time so it's always the same.

To control the clock, first wrap it in an infrastructure wrapper. Then control its behavior by using mocks or nullable infrastructure. These videos have more information:

* [Application Infrastructure](https://www.jamesshore.com/Blog/Lunch-and-Learn/Application-Infrastructure.html) describes how to create infrastructure wrappers.
* [Mocks & Spies](https://www.jamesshore.com/Blog/Lunch-and-Learn/Mocks-and-Spies.html) describes how to test code using mocks.
* [Testing Without Mocks](https://www.jamesshore.com/Blog/Lunch-and-Learn/Testing-Without-Mocks.html) shows how to make your infrastructure wrappers nullable.


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