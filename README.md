James Shore Live
================

This example code is used in my [Twitch.tv livestream](https://www.twitch.tv/jamesshorelive). See the individual episodes for more information. The episode archive is [available here](https://www.jamesshore.com/Blog/Lunch-and-Learn/).


This Week's Challenge (30 June 2020): How to Add a Feature
---------------------

This repository contains a simple HTTP server that implements a ROT-13 microservice. See "How the Microservice Works", below, for details.

Currently, the service expects a `content-type` header containing the exact string `application/json`. However, that's not the only legal way to specify the content type. Update the code so that it works properly with any legal header.

When adding this new feature, take care that the new code is designed well.

Hints:
* [RFC 7231](https://tools.ietf.org/html/rfc7231) specifies the `content-type` header.
	* It says that the header consists of a media type (`application/json`) followed by any number of semicolon-separated parameters (such as `application/json; charset=utf-8`).
	* The media type and the character set are case-insensitive.
	* There can be whitespace around the semicolons, but not in the media type or parameters.
* [RFC 8259](https://tools.ietf.org/html/rfc8259) defines the `application/json` media type.
	* It says that JSON must be encoded with UTF-8.
	* It also says no `charset` parameter is defined, and adding one has no effect.
* Despite the above, the real point of this challenge is the design, not the code.


The Thinking Framework
----------------------

(Previous episodes may be helpful. You can find them [here](https://www.jamesshore.com/Blog/Lunch-and-Learn/).)

When adding a new feature, follow these steps:

1. Understand the feature. What needs to be done, exactly?
	1. How is this different than the way the code works today?
	2. What parts of the new feature are important?
	3. What parts can be safely ignored? DTSTTCPW: Do the simplest thing that could possibly work.

2. Skim the existing design.
	1. Look at folder and file names, not details.
	2. Based on their names, make an educated guess: what are their one-sentence responsibilities?
	3. Look at function/method names inside files, if it helps, but avoid looking at every file.

3. Find the current implementation.
	1. Start with your review of file responsibilities.
	2. Make an educated guess, then read the code and tests to confirm.
	3. When you find the spot, try changing the code. If you're right, the behavior should change.

4. Find the file whose responsibilities best align with the new behavior.
	1. This isn't necessarily the code that implements the current behavior.
	2. Start with your review of file responsibilities.
	3. Think about information flows. Where is the data most relevant to the new behavior located?
	4. When you think of a likely spot, read the code to confirm. You may need to look at its dependencies instead.

5. Does the current implementation (step 3) connect to the place that is most responsible for the new behavior (step 4)?
	1. If not, is that a design flaw?
	2. If it is a design flaw, should you fix it?
	3. If it isn't a design flaw, go back to step 4. Find the part of the code that's next-most responsible for the new behavior.

6. Based on your analysis in step 5, decide how you're going to change the design of the code.
	1. How will you change the code that implements the current behavior? Programming by intention can help.
	2. How will you change the code that is going to be responsible for the new behavior?
	3. Programming by intention (pseudocoding calls to desired functions) inside current implementation can help.

7. Implement the feature.
	1. Think of your code as a graph of dependencies.
	2. Your changes are least disruptive if you start depth-first. Change the leaf dependencies first, in isolation.
	3. Then work your way up, wiring each higher node to the nodes underneath.
	4. The root node will be the old implementation. When it's been changed and wired up, you're done.

See the episode for details and an example of solving the challenge. After the livestream airs, you may find it in [the archive](https://www.jamesshore.com/Blog/Lunch-and-Learn/) on the following day (July 1st, 2020).


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

The service transforms text using ROT-13 encoding. In other words, `hello` becomes `urryb`.

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
Content-Type: application/json;charset=utf-8
Date: Tue, 30 Jun 2020 01:14:15 GMT

{
    "transformed": "uryyb"
}
```


License
-------

MIT License. See `LICENSE.txt`.