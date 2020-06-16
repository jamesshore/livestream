James Shore Live
================

This example code is used in my [Twitch.tv livestream](https://www.twitch.tv/jamesshorelive). See the individual episodes for more information. The episode archive is [available here](https://www.jamesshore.com/Blog/Lunch-and-Learn/).


This Week's Challenge (16 June 2020): Microservices Without Mocks (Part III)
---------------------

Create a microservice that serves the lucrative new ROT13-as-a-Service (RaaS) industry. Test-drive it, but don't use mocks (or spies) or broad integration tests. The API is up to you.

Part I (done): Start the server. When it starts, write "Server started on port XXX" to the command line. Don't handle requests yet.

Part II (done): Respond to requests. When a request is received, write "Request received" to the command line. Respond with status code 501 (Not Implemented) and the text "Not yet implemented".

Part III (this week): Encode requests. When a request is received, read the request body and encode it using `rot13.transform()` (in `src/logic/rot_13.js`). Respond with status code 200 (OK) and the transformed text.


The Thinking Framework
----------------------

In [previous episodes](https://www.jamesshore.com/Blog/Lunch-and-Learn/), we learned how to test code without writing mocks or broad integration tests. Now we'll apply what we've learned to a real-world problem.

If you need a refresher, these episodes have more:

* [Incremental Test-Driven Development](https://www.jamesshore.com/Blog/Lunch-and-Learn/Incremental-TDD.html). TDD basics.
* [Application Infrastructure](https://www.jamesshore.com/Blog/Lunch-and-Learn/Application-Infrastructure.html). How to build infrastructure wrappers.
* [Testing Without Mocks](https://www.jamesshore.com/Blog/Lunch-and-Learn/Testing-Without-Mocks.html). How to use overlapping sociable tests and nullable infrastructure wrappers to improve tests.
* [Microservices Without Mocks, Part 1: The Server](https://www.jamesshore.com/Blog/Lunch-and-Learn/Microservices-Without-Mocks-Part-1.html). How to build a nullable infrastructure wrapper for an HTTP server.
* [Microservices Without Mocks, Part 2: Robust Responses](https://www.jamesshore.com/Blog/Lunch-and-Learn/Microservices-Without-Mocks-Part-2.html). How to respond to HTTP requests for real and also test those requests without running a real server.

(For more details about testing without mocks, see James Shore's [Testing Without Mocks pattern language](https://www.jamesshore.com/Blog/Testing-Without-Mocks.html).)

This week's challenge raises a new question:

**1. How do we make requests testable?**

Create an [infrastructure wrapper](https://www.jamesshore.com/Blog/Lunch-and-Learn/Application-Infrastructure.html) for Node's request objects, then make it [nullable](https://www.jamesshore.com/Blog/Lunch-and-Learn/Testing-Without-Mocks.html).

**2. How do we control the values returned by the request?**

Use the "Configurable Responses" pattern. In your request wrapper's `createNull()` factory method, take an `options` parameter that defines the wrapper's values. Pass the options to your embedded stub. In the embedded stub, use the options to return the correct results.


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