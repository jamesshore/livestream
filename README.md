James Shore Live
================

This example code is used in my [Tuesday Lunch & Learn](https://www.jamesshore.com/v2/projects/lunch-and-learn) series. See that link for for more information and an archive of past episodes, or [watch live on Twitch](https://www.twitch.tv/jamesshorelive).


This Week's Challenge (11 Aug 2020): Testable Logs
---------------------

This repo contains a simple microservice. (You can find the details below, under "How the Microservice Works.") The service has good error handling, but it doesn't have any logging. Specifically, if the server code fails for some reason, the server will send an "Internal Server Error" response. But it won't log an error to stdout.

Your challenge, should you choose to accept it, is to add a small amount of error logging to the HttpServer class and to make sure that it's tested. Specifically, modify the "fails gracefully when request handler throws exception" and "fails gracefully when request handler returns invalid response" HttpServer tests to include logging. They're in `src/infrastructure/_http_server_test.js` on lines 125 and 136. They're already set up to instantiate the Log class and call `trackOutput()`. The result of calling `trackOutput()` is available in the `logOutput` variable on lines 128 and 139.

The logging library is just a placeholder, so the real challenge here is to write it from scratch. It should be thoroughly tested, of course. Your logs should include the current date and time and they should support structured output. (In other words, they should take arbitrary objects, including errors.)

There are several libraries available to help you. The CommandLine class (`src/infrastructure/command_line.js`) allows you to write to stdout. The Clock class (`src/infrastructure/clock.js`) gives you the ability to write the current date and time. Both of these are [Nullable Infrastructure Wrappers](http://www.jamesshore.com/v2/projects/lunch-and-learn/testing-without-mocks), so they have convenient methods for testing. There's also an infrastructure helper library (`src/util/infrastructure_helper.js`) that implements an [output tracker](https://www.jamesshore.com/v2/projects/lunch-and-learn/nullable-output).


Hints:

* There's a placeholder Log class and tests ready for you to modify in `src/infrastructure/log.js` and `src/infrastructure/_log_test.js`. A few methods have been added, but you'll need more. Don't change the names of the methods that are already there because the HttpServer tests depend on them. Specifically, the `logOutput` variable in the tests is the result of calling `trackOutput()` on an instance of Log.
* After you've built the logging library, the specific HttpServer code you need to modify is in the `handleRequestAsync()` function on line 82 of `src/infrastructure/http_server.js`.
* Make sure you're on Node.js version 14 or higher, as previous versions only include support for the US locale.

This challenge ties together several concepts from previous episodes. Here's where you can find more information:

* [Testing Without Mocks](http://www.jamesshore.com/v2/projects/lunch-and-learn/testing-without-mocks) describes what Nullable Infrastructure Wrappers are and how they work. It also explains the basics of the CommandLine class.
* [Microservices Without Mocks, Part 1: The Server](http://www.jamesshore.com/v2/projects/lunch-and-learn/microservices-without-mocks-part-1) and [Microservices Without Mocks, Part 2: Robust Responses](http://www.jamesshore.com/v2/projects/lunch-and-learn/microservices-without-mocks-part-2) builds the server code you'll be modifying. You don't need to watch them to succeed at this challenge, though.
* [International Dates and Times](https://www.jamesshore.com/v2/projects/lunch-and-learn/international-dates-and-times) explains how the Clock class works.
* [Nullable Output](http://www.jamesshore.com/v2/projects/lunch-and-learn/nullable-output) shows how to test infrastructure that writes multiple pieces of output, and also explains how the CommandLine class's `trackStdout()` function works.


The Thinking Framework
----------------------

(Previous episodes may be helpful. You can find them [here](https://www.jamesshore.com/v2/projects/lunch-and-learn).)

The Log class we're building is high-level infrastructure. High-level infrastructure is just like normal infrastructure, except that it uses infrastructure wrappers we've already written rather than talking directly to the outside world. Specifically, we can build it out of `Clock` and `CommandLine`.

Because Log is high-level infrastructure, we don't need the lots of [focused integration tests](http://www.jamesshore.com/v2/projects/lunch-and-learn/application-infrastructure) like we have before. Instead, we can focus our efforts on the logic.

As with any Nullable Infrastructure Wrapper, Log needs to have convenience methods to make testing easier, such as `trackOutput()`, which will let our tests see what has been written to the log. It's tempting to just return the value of `CommandLine.trackOutput()`, but Log is more powerful and easier to use if we write a new tracker that's custom-built for its needs.

Other than that, it's just a matter of building Log to work the way we want.

Tune in on August 11th at noon Pacific to see how I apply these ideas. For details, go to the [Lunch & Learn home page](https://www.jamesshore.com/v2/projects/lunch-and-learn). Starting August 12th, a video with my solution will be archived on that page.


Running the Code
----------------

To run the code in this repository, install [Node.js](http://nodejs.org). Then:

* Run `./run.sh` to run the code manually.

* Run `./build.sh` to lint and test the code once, or `./watch.sh` to do so every time a file changes.

* Use `./build.sh quick` or `./watch.sh quick` to perform an incremental build, and `./clean.sh` to reset the incremental build.

* On Windows, use the .cmd versions: `run` instead of `./run.sh`, `watch` instead of `./watch.sh`, etc. If you are using gitbash, the .sh versions will also work, and they display the output better.

All commands must be run from the repository root.


How the Microservice Works
--------------------------

Start the server using the run command described under "Running the Code." E.g., `./run.sh 5000`.

The service transforms text using ROT-13 encoding. In other words, `hello` becomes `uryyb`.

It has one endpoint:

* **URL**: `/rot13/transform`
* Method: `POST`
* Headers:
	* `content-type: application/json`
* Body: JSON object containing one field:
  * `text` the text to transform
  * E.g., `{ "text": "hello" }`
* Success Response:
	* Status: 200 OK
	* Body: JSON object containing one field:
		* `transformed` the transformed text
		* E.g., `{ "transformed": "uryyb" }`
* Failure Response
	* Status: 4xx (depending on nature of error)
	* Body: JSON object containing one field:
		* `error` the error
		* E.g., `{ "error": "invalid content-type header" }`

Make requests against the server using your favorite HTTP client. For example, [httpie](https://httpie.org/):

```sh
~ % http post :5000/rot13/transform content-type:application/json text=hello -v
POST /rot13/transform HTTP/1.1
Accept: application/json, */*;q=0.5
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 17
Host: localhost:5000
User-Agent: HTTPie/2.1.0
content-type: application/json

{
    "text": "hello"
}

HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 23
Content-Type: application/json
Date: Tue, 30 Jun 2020 01:14:15 GMT

{
    "transformed": "uryyb"
}
```


License
-------

MIT License. See `LICENSE.txt`.