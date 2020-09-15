James Shore Live
================

This example code is used in my [Tuesday Lunch & Learn](https://www.jamesshore.com/v2/projects/lunch-and-learn) series. See that link for for more information and an archive of past episodes, or [watch live on Twitch](https://www.twitch.tv/jamesshorelive).


This Week's Challenge (15 Sep 2020): Request Timeouts
---------------------

This repo contains a command-line client/server application. The command-line application calls a small microservice, which encodes text using ROT-13 encoding. (You can find the details below, under "Running the Code" and "How the Microservice Works.")

The client-side code has good error-handling, with one exception: it doesn't have any timeouts. Not so coincidentally, the server has been programmed to randomly delay for 30 seconds before responding to some requests.

Your challenge this week is to update the command-line application to gracefully time out and display an error if the server doesn't respond within a short period of time. (The amount of time is up to you; I suggest five seconds.) You don't need to deal with cancelling requests or timers this week, so it's okay if the CLI doesn't exit right away after displaying the error.

As always, make sure that your code is well tested.

Hints:

* Make sure you're on Node.js version 14 or higher. Previous versions fail the test suite due to insufficient locale support.

* The command-line application is implemented in `src/rot13-cli/rot13_cli.js` and `_rot13_cli_test.js`. It depends on `src/rot13-cli/infrastructure/rot13_client.js` to parse the microservice response, and that in turn depends on `src/rot13-cli/infrastructure/http_client.js` to perform the HTTP request.

* The assertion library used by the tests, `/src/node_modules/util/assert.js`, is a thin wrapper over [Chai](https://www.chaijs.com/api/assert/), a JavaScript assertion library. It has a few extra assertions that you might find useful, such as `assert.promiseDoesNotResolveAsync()`, which should tell you if a promise doesn't resolve.

* There's a Nullable Clock class available in `src/node_modules/infrastructure/clock.js`. You can use it to control the current time in your tests. It also has a `waitAsync()` method that will be useful in your production code. For more information about how it works, see its tests, or check out the [No More Flaky Clock Tests](https://www.jamesshore.com/v2/projects/lunch-and-learn/no-more-flaky-clock-tests) episode.

* JavaScript's [Promise.race()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) function will let you `Clock.waitAsync()` and `Rot13Client.transformAsync()` side-by-side. `Promise.race()` will return the result (or throw the exception) from whichever one finishes first.


The Thinking Framework
----------------------

(Previous episodes may be helpful. You can find them [here](https://www.jamesshore.com/v2/projects/lunch-and-learn).)

Writing code to time out isn't too difficult, since we're not dealing with cancellation this week. As usual when infrastructure is involved, the main challenge is *testing* the code.

To test the code, you need to have the ability to simulate a hang. This is the kind of thing we've used the [Nullable Infrastructure Wrapper](https://www.jamesshore.com/v2/blog/2018/testing-without-mocks#nullable-infrastructure) and [Embedded Stub](https://www.jamesshore.com/v2/blog/2018/testing-without-mocks#embedded-stub) patterns for in the past, and that's a valid approach here, too. Specifically, you can modify `HttpClient.createNull()` to pass a `hang` option to HttpClient's embedded stub. (To see how the embedded stub works, see the [Microservice Clients Without Mocks, Part 1](https://www.jamesshore.com/v2/projects/lunch-and-learn/microservice-clients-without-mocks-part-1) episode.)

Once HttpClient supports hangs, it's fairly easy for Rot13Client to support it too--it just needs to delegate to HttpClient. And once that's done, you're ready to implement the application code.

Testing the application code requires you to control the clock. Fortunately, the Clock class we built in [No More Flaky Clock Tests](https://www.jamesshore.com/v2/projects/lunch-and-learn/no-more-flaky-clock-tests) is still available. You can use that to wait for a timeout. In your production code, JavaScript's [Promise.race()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) function will allow you to run the timeout and network request side by side.

Tune in on September 15th at noon Pacific to see how I apply these ideas. For details, go to the [Lunch & Learn home page](https://www.jamesshore.com/v2/projects/lunch-and-learn). Starting September 16th, a video with my solution will be archived on that page.


Running the Code
----------------

To run the code in this repository, install [Node.js](http://nodejs.org). Make sure you have version 14 or higher. Then:

* Run `./serve.sh [port]` to run the ROT-13 service, then `./run.sh [port] [text]` to run the command-line application.

* Run `./build.sh` to lint and test the code once, or `./watch.sh` to do so every time a file changes.

* Use `./build.sh quick` or `./watch.sh quick` to perform an incremental build, and `./clean.sh` to reset the incremental build.

* On Windows, use the .cmd versions: `run` instead of `./run.sh`, `watch` instead of `./watch.sh`, etc. If you are using gitbash, the .sh versions will also work, and they display the output better.

All commands must be run from the repository root.


How the Microservice Works
--------------------------

Start the server using the run command described under "Running the Code." E.g., `./serve.sh 5000`.

The service transforms text using ROT-13 encoding. In other words, `hello` becomes `uryyb`. Some responses (randomly chosen) are delayed for 30 seconds.

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
	* Headers: `content-type: application/json`
	* Body: JSON object containing one field:
		* `transformed` the transformed text
		* E.g., `{ "transformed": "uryyb" }`
* Failure Response
	* Status: 4xx (depending on nature of error)
	* Headers: `content-type: application/json`
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