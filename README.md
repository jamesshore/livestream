James Shore Live
================

This example code is used in my [Tuesday Lunch & Learn](https://www.jamesshore.com/Blog/Lunch-and-Learn/) series. See that link for for more information and an archive of past episodes, or [watch live on Twitch](https://www.twitch.tv/jamesshorelive).


This Week's Challenge (21 July 2020): International Dates and Times
---------------------

This codebase contains a simple countdown application. Every second, it prints out one line from an array of strings. Modify this code so that it prints the current time at the end, using the local time zone and language. For example:

* In the US, display "Dec 31, 1969, 4:00 PM" (but use the current time).
* In Bangalore, assuming a Kannada speaker, display "ಜನವರಿ 1, 1970 05:30 ಪೂರ್ವಾಹ್ನ".
* In Ukraine, display "1 січ. 1970 р., 03:00"

As usual, the challenge isn't the application. The challenge is writing tests that still work *regardless of who runs them.* If somebody in India, the US, or Ukraine runs the tests, they should all see a passing test, even though the actual application will give each of them different results.

Tune in on July 21st at noon Pacific to see my solution. For details, go to the [Lunch & Learn home page](https://www.jamesshore.com/Blog/Lunch-and-Learn/). Starting July 22nd, my solution will be archived on that page.

Hints:

* `src/countdown.js` and `src/_countdown_test.js` are where you'll add the code and tests for printing the current time.
* However, most of your work will probably be in `src/infrastructure/clock.js` and `src/infrastructure/_clock_test.js`, which is a nullable wrapper for the system clock. For details about how it works, see last week's episode, ["No More Flaky Clock Tests](https://www.jamesshore.com/Blog/Lunch-and-Learn/No-More-Flaky-Clock-Tests.html)".
* You can use [Date.toLocaleString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString) or [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) to localize the date and time.
* Make sure you're on Node.js version 14 or higher, as previous versions only include support for the US locale.


The Thinking Framework
----------------------

(Previous episodes may be helpful. You can find them [here](https://www.jamesshore.com/Blog/Lunch-and-Learn/).)

The hard part of this week's challenge is the mismatch between what our tests need to do and what our application needs to do. Our *application* needs to display answers in the computer's local time zone and language. Our *tests* need to work the same way for everyone, regardless of their local time zone and language.

The solution for this problem is the same as it is for any other external state: [create an infrastructure wrapper](https://www.jamesshore.com/Blog/Lunch-and-Learn/Application-Infrastructure.html). Once you have a wrapper for your time zone and locale, you can either [mock it out in your tests](https://www.jamesshore.com/Blog/Lunch-and-Learn/Mocks-and-Spies.html) or make it [nullable](https://www.jamesshore.com/Blog/Lunch-and-Learn/Testing-Without-Mocks.html). Either way, this allows your tests to control the time zone and locale.

This codebase already has a nullable infrastructure wrapper for the system clock that we built [in our last episode](https://www.jamesshore.com/Blog/Lunch-and-Learn/No-More-Flaky-Clock-Tests.html). It makes sense to extend it to support time zones and locales as well. In a larger, more complicated program, we might make a dedicated infrastructure wrapper just for the time zone and locale.


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