James Shore Live
================

This example code is used in my [Twitch.tv livestream](https://www.twitch.tv/jamesshorelive). See the individual episodes for more information. The episode archive is [available here](https://www.jamesshore.com/Blog/Lunch-and-Learn/).


This Week's Challenge (12 May 2020)
-----------------------------------

Make a small ROT-13 command-line application using the algorithm [we built last week](https://www.jamesshore.com/Blog/Lunch-and-Learn/Incremental-TDD.html), but do so in a way that isolates the command-line infrastructure from the rest of the application. Write tests to prove that the infrastructure is being used correctly.


The Thinking Framework
----------------------

Infrastructure code talks over a network, interacts with a file system, or involves some other communication with external state. It's often complicated and difficult to test, but if you don't test it, you're likely to have bugs.

You can use two techniques to isolate the complexity of your infrastructure and make it easier to test:

**1. Infrastructure Wrappers.**

Create a wrapper—a single class or module—for each piece of infrastructure that you use. For each wrapper, provide an API that provides a crisp, clean view of the messy outside world. Design your API to be focused on the needs of your application rather than the implementation of the infrastructure. Put all the code that interacts with infrastructure in the wrappers.

By doing so, you'll isolate your infrastructure behind an interface that you control. When the infrastructure changes in the future, or if you find yourself switching to a different provider, you can change the wrapper without changing the rest of your application.

**2. Focused Integration Tests.**

Your application's correctness depends on it using its infrastructure correctly, so test each infrastructure wrapper with a "focused integration test." A focused integration test is like a unit test, in that it checks that a single part of your code is working, but unlike a unit test, it runs code that talks to the outside world.

When testing your infrastructure wrappers, test the external communication for real. For file system code, checks that it reads and writes real files. For databases and services, access a real database or service whenever possible. Make sure that your test systems are configured identically to your production systems (except for using test data instead of production data). Otherwise your code will fail in production when it encounters subtle incompatibilities.


Running the Code
----------------

To run the code in this repository, install [Node.js](http://nodejs.org). Then:

* Run `./build.sh` to run the tests once, or `./watch.sh` to run the tests every time a file changes.

* Use `./build.sh quick` or `./watch.sh quick` to perform an incremental build, and `./clean.sh` to reset the incremental build.

* On Windows, use `build` or `build quick` and `watch` or `watch quick` instead. If you are using gitbash, the `*.sh` versions will also work, and they display the output better.

All commands must be run from the repository root.


License
-------

MIT License. See `LICENSE.txt`.