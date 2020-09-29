James Shore Live
================

This example code is used in my [Tuesday Lunch & Learn](https://www.jamesshore.com/v2/projects/lunch-and-learn) series. See that link for for more information and an archive of past episodes, or [watch live on Twitch](https://www.twitch.tv/jamesshorelive).


This Week's Challenge (29 Sep 2020): Microservice Architecture Without Microservice Overhead
---------------------

This repo contains a command-line client/server application. The command-line application calls a small microservice that encodes text using ROT-13 encoding. (You can find the details below, under "Running the Code" and "How the Microservice Works.")

The advantage of microservice architecture in this case is that it enforces a strong boundary between the command-line code and the ROT-13 encoding code. Theoretically, they could be worked on by separate teams without issue.

However, the microservice architecture also adds a lot of complexity in the form of extra network and error handling code.

Your challenge is to retain the strong separation between client and server code while removing the extra complexity. Specifically:

* Cut the code size in at least half
* Cut the number of tests in at least half
* Improve the run-time performance
* Improve the test performance

The code is very well tested; as you refactor, ensure that it remains so.

Hints:

* Make sure you're on Node.js version 14 or higher. Previous versions fail the test suite due to insufficient locale support.

* The client code is in `src/rot13-cli` and the server code is in `src/rot13-service`. They have shared code in `src/node_modules` (not to be confused with the top-level `node_modules`, which is for third-party libraries.)


The Thinking Framework
----------------------

(Previous episodes may be helpful. You can find them [here](https://www.jamesshore.com/v2/projects/lunch-and-learn).)

The secret to this week's challenge is that microservice architecture is both a design technique and a protocol choice. To solve it, you need to keep the design technique while replacing the protocol. Specifically, keep the isolation between client and server, but replace the HTTP network calls with direct function calls.

To keep the isolation, you can use a technique I'm calling "microliths."

A microlith is a microservice in a monolith. You design a cluster of microliths the same way you design a cluster of microservices. But when you implement it, you use function calls rather than network calls.

For the provider, instead of serving the API over HTTP, provide a top-level module with functions in the place of endpoints.

For the clients, continue to use [Infrastructure Wrappers](https://www.jamesshore.com/v2/projects/lunch-and-learn/application-infrastructure), but have them call the provider's functions rather than making HTTP requests.

The end result is much less complexity while still having strong isolation between components. You can even use static code analysis (linting) to enforce that nobody calls functions they're not supposed to. Because the call is abstracted behind an Infrastructure Wrapper, it's easy to refactor from microlith to microservice, and back, as needed.

Tune in on September 29th at noon Pacific to see how I apply these ideas. For details, go to the [Lunch & Learn home page](https://www.jamesshore.com/v2/projects/lunch-and-learn). Starting September 30th, a video with my solution will be archived on that page.


Running the Code
----------------

To run the code in this repository, install [Node.js](http://nodejs.org). Make sure you have version 14 or higher. Then:

* Run `./serve.sh [port]` to run the ROT-13 service, then `./run.sh [port] [text]` to run the command-line application.

* Run `./build.sh` to lint and test the code once, or `./watch.sh` to do so every time a file changes.

* Use `./build.sh quick` or `./watch.sh quick` to perform an incremental build, and `./clean.sh` to reset the incremental build.

* On Windows, use the .cmd versions: `run` instead of `./run.sh`, `watch` instead of `./watch.sh`, etc. If you're using gitbash, the .sh versions will also work, and they display the output better.

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