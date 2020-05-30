James Shore Live
================

This example code is used in my [Twitch.tv livestream](https://www.twitch.tv/jamesshorelive). See the individual episodes for more information. The episode archive is [available here](https://www.jamesshore.com/Blog/Lunch-and-Learn/).


This Week's Challenge (2 June 2020): Microservices Without Mocks
---------------------

Create a microservice that serves the lucrative new ROT13-as-a-Service (RaaS) industry. Test-drive it, but don't use mocks (or spies) or broad integration tests. The API is up to you.


The Thinking Framework
----------------------

Although mocks (and spies) are useful for testing interactions and isolating code, that isolation comes at a cost. Changes in dependencies semantics won't cause the tests to fail. As a result, mock-based tests must be supplemented with integration tests.

You can avoid these problems by not using mocks in your tests. James Shore's [Testing Without Mocks pattern language](https://www.jamesshore.com/Blog/Testing-Without-Mocks.html) has the details. Two key pieces are Overlapping Sociable Tests and Nullable Infrastructure.

**1. Overlapping Sociable Tests**

When testing the interactions between a unit and its dependencies, inject real dependency instances, not test doubles, into the unit under test. Don't test the dependencies' behavior itself, but do test that the unit under test uses the dependencies correctly.

This will create a strong linked chain of tests. Each test will check the unit under test *and* its usage of its dependencies. The test suite as a whole will cover your whole application in a fine overlapping mesh, giving you the coverage of integration tests without needing to write them.

**2. Nullable Infrastructure**

Program your infrastructure wrappers so they can be "turned off" by instantiating "null" versions, such as by calling `Wrapper.createNull()`. These null instances should behave identically to the real thing—by running the exact same code as the real thing—except for the very minimum necessary to turn off their interactions with infrastructure. As this code will be part of your production infrastructure wrapper, it should be written as production-grade code, including tests.

To make it possible to test your infrastructure, add methods to reveal how the infrastructure has been used. In your `createNull()` factory, provide the ability to configure method return values.

Implement this cleanly by writing small stubs of the third-party infrastructure you're using. (See the video or [Testing Without Mocks](https://www.jamesshore.com/Blog/Testing-Without-Mocks.html) article for details.)


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