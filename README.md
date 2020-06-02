James Shore Live
================

This example code is used in my [Twitch.tv livestream](https://www.twitch.tv/jamesshorelive). See the individual episodes for more information. The episode archive is [available here](https://www.jamesshore.com/Blog/Lunch-and-Learn/).


This Week's Challenge (2 June 2020): Microservices Without Mocks (Part I)
---------------------

Create a microservice that serves the lucrative new ROT13-as-a-Service (RaaS) industry. Test-drive it, but don't use mocks (or spies) or broad integration tests. The API is up to you.

Part I: Build the server. When the server receives a request, write "Request received" to the command-line.


The Thinking Framework
----------------------

In [previous episodes](https://www.jamesshore.com/Blog/Lunch-and-Learn/), we learned how to test code without writing mocks or broad integration tests. Now we'll apply what we've learned to a real-world problem.

If you need a refresher, these episodes have more:

* [Incremental Test-Driven Development](https://www.jamesshore.com/Blog/Lunch-and-Learn/Incremental-TDD.html). TDD basics.
* [Application Infrastructure](https://www.jamesshore.com/Blog/Lunch-and-Learn/Application-Infrastructure.html). How to build infrastructure wrappers.
* [Testing Without Mocks](https://www.jamesshore.com/Blog/Lunch-and-Learn/Testing-Without-Mocks.html). How to use overlapping sociable tests and nullable infrastructure wrappers to improve tests.

(For more details about testing without mocks, see James Shore's [Testing Without Mocks pattern language](https://www.jamesshore.com/Blog/Testing-Without-Mocks.html).)

This week's challenge raises several new questions.

**1. Where do we begin?**

Use "Programming by Intention" to sketch out the code you need. In Programming by Intention, you write code that calls the functions you *wish* you had available. Focus on making the code readable and clean. (You don't need to make it work, though. It's pseudocode.) Then command it out and implement the missing functions for real. Once they're ready, test, uncomment, and fix up the pseudocode.

**2. How do we test without launching the server?**

Create an [infrastructure wrapper](https://www.jamesshore.com/Blog/Lunch-and-Learn/Application-Infrastructure.html) for the server, then make it [nullable](https://www.jamesshore.com/Blog/Lunch-and-Learn/Testing-Without-Mocks.html).

**3. How do we test that our code responds to HTTP requests?**

Build behavior simulation into your server wrapper. "Behavior simulation" is a production method that generates events as if they were real. In this case, you could have a method such as `httpServer.simulateRequest()` method that runs the same code a real request does.


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