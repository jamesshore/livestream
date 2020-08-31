James Shore Live
================

This example code is used in my [Tuesday Lunch & Learn](https://www.jamesshore.com/v2/projects/lunch-and-learn) series. See that link for for more information and an archive of past episodes, or [watch live on Twitch](https://www.twitch.tv/jamesshorelive).


This Week's Challenge (25 Aug 2020): Microservice Clients Without Mocks (Part I)
---------------------

This repo contains a simple microservice in the `src/rot13-service` folder. It encodes text using ROT-13 encoding. (You can find the details below, under "How the Microservice Works.") Next week, we'll create a command-line application that uses the microservice to encode text provided on the command line.

This week, your challenge is to create a generic HTTP client that we'll use to build the command-line application next week. You don't need to build anything specific to the ROT-13 service. The only thing we're doing this week is the generic HTTP client.

The client needs to be testable without mocks. In practice, this means that it should be a [nullable infrastructure wrapper](http://www.jamesshore.com/v2/projects/lunch-and-learn/testing-without-mocks). It also needs to provide the ability to track requests and configure responses.

Hints:

* Make sure you're on Node.js version 14 or higher. Previous versions fail the test suite due to insufficient locale support.

* There's a placeholder HttpClient class and tests ready for you to modify in `src/rot13-cli/infrastructure`. You shouldn't need to modify any other files.

* The infrastructure helper library (`src/util/infrastructure_helper.js`) implements an [output tracker](https://www.jamesshore.com/v2/projects/lunch-and-learn/nullable-output) that you can use. See the [Testable Logs episode](https://www.jamesshore.com/v2/projects/lunch-and-learn/testable-logs) for an example.

This challenge ties together several concepts from previous episodes. Here's where you can find more information:

* [Testing Without Mocks](http://www.jamesshore.com/v2/projects/lunch-and-learn/testing-without-mocks) describes what Nullable Infrastructure Wrappers are and how they work. It also explains the basics of the CommandLine class.
* [Microservices Without Mocks, Part 1: The Server](http://www.jamesshore.com/v2/projects/lunch-and-learn/microservices-without-mocks-part-1) and [Microservices Without Mocks, Part 2: Robust Responses](http://www.jamesshore.com/v2/projects/lunch-and-learn/microservices-without-mocks-part-2) show how to build an HTTP server, which involves many of the same skills needed for this week's challenge.


The Thinking Framework
----------------------

(Previous episodes may be helpful. You can find them [here](https://www.jamesshore.com/v2/projects/lunch-and-learn).)

This week, we're building a new piece of low-level infrastructure. It doesn't have any use on its own, but in the future, we'll use it to build a high-level ROT-13 service client.

There are two main aspects to this challenge:

1) HttpClient is low-level infrastructure, so we need to write focused integration tests to make sure it works. This will require us to write a simple [Spy Server](https://www.jamesshore.com/v2/blog/2018/testing-without-mocks#spy-server). You could also use a tool such as [Nock](https://github.com/nock/nock) or [WireMock](http://wiremock.org/), but a simple purpose-built Spy Server is only a few dozen lines of code.

2) Using services can involve complicated series of calls. We need to write our null HttpClient to support sophisticated [Configurable Responses](https://www.jamesshore.com/v2/blog/2018/testing-without-mocks#configurable-responses). Specifically, we need to support multiple endpoints, each with multiple different responses.

	To do so, our `responses` variable will be an object, which, in JavaScript, is a set of name-value pairs. The names will correspond to endpoints and the values will be arrays of responses. Each time the null client receives a request, it will shift the next response from the front of the array.

Tune in on August 25th at noon Pacific to see how I apply these ideas. For details, go to the [Lunch & Learn home page](https://www.jamesshore.com/v2/projects/lunch-and-learn). Starting August 26th, a video with my solution will be archived on that page.


Running the Code
----------------

To run the code in this repository, install [Node.js](http://nodejs.org). Make sure you have version 14 or higher. Then:

* Run `./serve.sh` to run the ROT-13 service, then `./run.sh` to run the command-line application.

* Run `./build.sh` to lint and test the code once, or `./watch.sh` to do so every time a file changes.

* Use `./build.sh quick` or `./watch.sh quick` to perform an incremental build, and `./clean.sh` to reset the incremental build.

* On Windows, use the .cmd versions: `run` instead of `./run.sh`, `watch` instead of `./watch.sh`, etc. If you are using gitbash, the .sh versions will also work, and they display the output better.

All commands must be run from the repository root.


How the Microservice Works
--------------------------

Start the server using the run command described under "Running the Code." E.g., `./serve.sh 5000`.

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