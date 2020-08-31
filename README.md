James Shore Live
================

This example code is used in my [Tuesday Lunch & Learn](https://www.jamesshore.com/v2/projects/lunch-and-learn) series. See that link for for more information and an archive of past episodes, or [watch live on Twitch](https://www.twitch.tv/jamesshorelive).


This Week's Challenge (1 Sep 2020): Microservice Clients Without Mocks (Part II)
---------------------

This repo contains a simple microservice in the `src/rot13-service` folder. It encodes text using ROT-13 encoding. (You can find the details below, under "How the Microservice Works.") Your challenge is to create a command-line application that uses this microservice.

There are two main parts to this challenge:

1. The command-line application needs to be testable without mocks.

2. It needs to have robust error handling. It should gracefully fail if the service is unavailable or if the service changes its API. You don't need to handle timeouts, though.

Hints:

* Make sure you're on Node.js version 14 or higher. Previous versions fail the test suite due to insufficient locale support.

* The command-line application is partially implemented for you in `src/rot13-cli/rot13_cli.js` and `_rot13_cli_test.js`.

* A generic HTTP client is available for your use in `src/rot13-cli/infrastructure/http_client.js`. See [last week's episode](https://www.jamesshore.com/v2/projects/lunch-and-learn/microservice-clients-without-mocks-part-1) to see how it was created.

* There's a placeholder client for the ROT-13 service in `src/rot13-cli/infrastructure/rot13_client.js` and `_rot13_client_test.js`.

* The rough architecture is that `rot13_cli.js` depends on `rot13_client.js`, and `rot13_client.js` uses `http_client.js` to talk to the ROT-13 service.

* The infrastructure helper library (`src/util/infrastructure_helper.js`) implements an [output tracker](https://www.jamesshore.com/v2/projects/lunch-and-learn/nullable-output) that you can use in `rot13_client.js`. See the [Testable Logs episode](https://www.jamesshore.com/v2/projects/lunch-and-learn/testable-logs) for an example.

This challenge ties together several concepts from previous episodes. Here's where you can find more information:

* [Testing Without Mocks](http://www.jamesshore.com/v2/projects/lunch-and-learn/testing-without-mocks) describes what Nullable Infrastructure Wrappers are and how they work. It also explains the basics of the CommandLine class.
* [Testable Logs](https://www.jamesshore.com/v2/projects/lunch-and-learn/testable-logs) shows how to create a high-level infrastructure wrapper that depends on low-level infrastructure. This is similar to how `rot13_client.js` will work.


The Thinking Framework
----------------------

(Previous episodes may be helpful. You can find them [here](https://www.jamesshore.com/v2/projects/lunch-and-learn).)

You can solve this week's challenge in four steps:

1) **Design the Rot13Client interface.** One way to do so is to use Programming By Intention to decide how Rot13Client will be used. To do so, write Rot13Cli code and tests as if Rot13Client already existed and was complete. Then comment out that code—or stub it out—and write the Rot13Client using the same interface.

2) **Build the Rot13Client with good error handling.** Rot13Client is high-level infrastructure, which means that it can depend on HttpClient for all its networking. Most of your work will involve error-handling logic.

	Start by implementing a simple request and response. In your tests, use `HttpClient.createNull()` to force the response you want, and `httpClient.trackRequests()` to check that you made the correct requests.

	When the happy path is done, handle all the error cases you can think of. Assume that anything the service can do wrong, it will do wrong. This means you'll need to check the status code, headers, and all possible ways the body can be malformed. Don't worry about network delays or timeouts for today's exercise. As with the happy path code, you can test this behavior by using a null HttpClient.

3) **Make the Rot13Client Nullable and Trackable.** Add code to Rot13Client to make it easy to write the Rot13Cli tests. Look back at Programming By Intention you did in step 1 for ideas. Don't forget that Rot13Cli needs to test error handling.

4) **Integrate the CLI.** Once the Rot13Client is done, finish up the Rot13Cli and its tests. Double-check it by running the code manually. When the server is running, it should work properly. When the server isn't running, it should fail gracefully. (See below for instructions about running the server and CLI.)

Tune in on September 1st at noon Pacific to see how I apply these ideas. For details, go to the [Lunch & Learn home page](https://www.jamesshore.com/v2/projects/lunch-and-learn). Starting September 2nd, a video with my solution will be archived on that page.


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