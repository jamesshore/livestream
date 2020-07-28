James Shore Live
================

This example code is used in my [Tuesday Lunch & Learn](https://www.jamesshore.com/v2/projects/lunch-and-learn) series. See that link for for more information and an archive of past episodes, or [watch live on Twitch](https://www.twitch.tv/jamesshorelive).


This Week's Challenge (28 July 2020): Idiot-Proof APIs
---------------------

This codebase includes a "Clock" class that can be used to convert the current time to a string. Your challenge this week is to improve the API for this code so that it's difficult to use incorrectly.

To put it another way: Imagine somebody is building a logging tool. Part of the task is to write the current date and time to stdout, in exactly (and only!) this format: `July 27, 2020, 13:54:14 UTC`. But the Clock class has a few design flaws that makes certain mistakes easy. Which mistakes are they, and how can you prevent them?

Start by test-driving some simple code to write out the current date and time. (Use `src/clock_example.js` and `src/_clock_example_test.js` for this purpose.) Make a note of the flaws in Clock, then improve the code to make it easier to use and less error-prone.

Hints:

* The clock code is in `src/infrastructure/clock.js` and `src/infrastructure/_clock_test.js`.
* Use `src/infrastructure/command_line.js` to test-drive output to the command line.
* `Clock` and `CommandLine` are "nullable infrastructure wrappers." You can learn more about this pattern in [the "Testing Without Mocks" episode](https://www.jamesshore.com/v2/projects/lunch-and-learn/testing-without-mocks).
* To learn more about how Clock works, see [the "International Dates and Times" episode](https://www.jamesshore.com/v2/projects/lunch-and-learn/international-dates-and-times).
* Make sure you're on Node.js version 14 or higher, as previous versions only include support for the US locale.


The Thinking Framework
----------------------

(Previous episodes may be helpful. You can find them [here](https://www.jamesshore.com/v2/projects/lunch-and-learn).)

The Clock code in this challenge is good code, but it's not *great* code. The difference between "good" and "great" is how well an API guides the programmers who use the API to success. I'll call these people "programmer-users."

As the code is currently written, it's easy for programmer-users to make a mistake with time zones and locales. The task at hand (write out the current time in a particular format) requires a specific time zone and locale. But by default, Clock uses the computer's current time zone and locale. This isn't obvious without reading the code or tests.

If the programmer-user's current time zone and locale coincidentally match the time zone and locale needed by the task, it's easy for them to think the code is working correctly when it actually has a bug. The code will work on the programmer-user's machine, and then stop working when it's run in a different time zone or locale.

To improve APIs, consider the following:

1. People don't read documentation unless they have to. So use method and variable names to help document the code.

2. Sometimes it's better to provide *inconvenient* defaults. Inconvenient defaults make it obvious that you've used something incorrectly. Convenient defaults sometimes make things work by coincidence, only to break later.

3. Not providing defaults at all forces programmer-users to explicitly specify the behavior they want. This prevents their code from working by coincidence.

4. Writing code to fail fast, with hand-crafted error messages, can help programmer-users learn how to use an API correctly.

Tune in on July 28th at noon Pacific to see how I apply these ideas to improve the Clock API. For details, go to the [Lunch & Learn home page](https://www.jamesshore.com/v2/projects/lunch-and-learn). Starting July 29th, my solution will be archived on that page.



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