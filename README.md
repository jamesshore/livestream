James Shore Live
================

This example code is used in my [Twitch.tv livestream](https://www.twitch.tv/jamesshorelive). See the individual episodes for more information. The episode archive is [available here](https://www.jamesshore.com/Blog/Lunch-and-Learn/).


This Week's Challenge (23 June 2020): Microservices Without Mocks (Part IV)
---------------------

Create a microservice that serves the lucrative new ROT13-as-a-Service (RaaS) industry. Test-drive it, but don't use mocks (or spies) or broad integration tests. The API is up to you.

Part I (done): Start the server. When it starts, write "Server started on port XXX" to the command line. Don't handle requests yet.

Part II (done): Respond to requests. When a request is received, write "Request received" to the command line. Respond with status code 501 (Not Implemented) and the text "Not yet implemented".

Part III (done): Encode requests. When a request is received, read the request body and encode it using `rot13.transform()` (in `src/logic/rot_13.js`). Respond with status code 200 (OK) and the transformed text.

Part IV (this week): Route requests. When a request is received, validate the URL, method, and headers, then parse the body as JSON and respond with a JSON payload. Respond with appropriate errors if the validation or parsing fails. The challenge is to do so in a way that is well designed.


The Thinking Framework
----------------------

In [previous episodes](https://www.jamesshore.com/Blog/Lunch-and-Learn/), we learned how to test code without writing mocks or broad integration tests. Now we'll apply what we've learned to a real-world problem.

If you need a refresher, these episodes have more:

* [Incremental Test-Driven Development](https://www.jamesshore.com/Blog/Lunch-and-Learn/Incremental-TDD.html). TDD basics.
* [Application Infrastructure](https://www.jamesshore.com/Blog/Lunch-and-Learn/Application-Infrastructure.html). How to build infrastructure wrappers.
* [Testing Without Mocks](https://www.jamesshore.com/Blog/Lunch-and-Learn/Testing-Without-Mocks.html). How to use overlapping sociable tests and nullable infrastructure wrappers to improve tests.
* [Microservices Without Mocks, Part 1: The Server](https://www.jamesshore.com/Blog/Lunch-and-Learn/Microservices-Without-Mocks-Part-1.html). How to build a nullable infrastructure wrapper for an HTTP server.
* [Microservices Without Mocks, Part 2: Robust Responses](https://www.jamesshore.com/Blog/Lunch-and-Learn/Microservices-Without-Mocks-Part-2.html). How to respond to HTTP requests for real and also test those requests without running a real server.
* [Microservices Without Mocks, Part 3: Reliable Requests](https://www.jamesshore.com/Blog/Lunch-and-Learn/Microservices-Without-Mocks-Part-3.html). How to buid a nullable infrastructure wrapper for HTTP requests.

(For more details about testing without mocks, see James Shore's [Testing Without Mocks pattern language](https://www.jamesshore.com/Blog/Testing-Without-Mocks.html).)

In this week’s challenge, all our HTTP infrastructure is complete. We just need to design and implement the routing code.

**How can we best design our code?**

There are two parts to the answer, which some people call (somewhat tongue in cheek) "code whispering." It's also known as "evolutionary design."

*First,* a good design sense is critical. If you don't know the difference between good design and bad design, no technique can guarantee success. An excellent resource for honing your design sense is Martin Fowler’s [Refactoring](https://refactoring.com/) book.

*Second,* if you have a good design sense, you'll be tempted to start designing early. Restrain that urge! Designing too early leads to over-complicated flights of fancy. Instead, listen to the code.

1. Notice poor design. Two easy things to look for:
	a. Code that's doing too much--look for sets of methods that "clump" together.
	b. Tests that are overcomplicated--look for tests have more setup than they really need.
2. When you see poor design, put your feature work on pause and imagine ways to improve it.
3. If your ideas simplify the code or make it easier to understand, refactor.
	a. If your code does too much, or your tests are overcomplicated, that's a sign to extract a module or class.
	b. Refactoring is *moving* code around, not *rewriting* code.

If you're using sociable tests, as we've been doing for this exercise, you can refactor your code without breaking any tests. Once you've refactored your code, take a second look at your tests to see if the new design allows them to be simplified or improved.


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