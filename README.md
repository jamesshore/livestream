James Shore Live
================

This example code is used in my [Twitch.tv livestream](https://www.twitch.tv/jamesshorelive). See the individual episodes for more information.


This Week's Challenge (5 May 2020)
-----------------------------------

Implement a ROT-13 algorithm using Test-Driven Development and small steps.

ROT-13 is a Caesar cypher that rotates the letters of the alphabet 13 places. "A" becomes "N", "B" becomes "O," etc. And vice-versa. "N" becomes "A." ROT-13 is popular for hiding spoilers on the Internet because running the algorithm twice in a row gives you the original text back.


The Thinking Framework
----------------------

**Eat the Onion from the Inside Out.**

Problems are made of layers, like ogres, and onions. To break the problem down into small steps, start with the inner-most layer. Find the thing that everything else depends on and build that first. Then build the thing that depends on it, and the thing that depends on that, and so forth, until you've solved everything.

Starting with the innermost layer often looks something like this:

1. Interface - everything depends on the interface you decide to build.
2. Calculations and branches
3. Loops and generalization
4. Special cases and error handling

Some people call this "Zero, One, Many." James Grenning talks about [ZOMBIES](http://blog.wingman-sw.com/tdd-guided-by-zombies). "Uncle Bob" Martin has his [Transformation Priority Premise](https://blog.cleancoder.com/uncle-bob/2013/05/27/TheTransformationPriorityPremise.html). No matter how you slice it, it's about solving the easy, core problems first, and working out from there.


Running the Code
----------------

To run the code in this repository, install [Node.js](http://nodejs.org). Then:

* Run `./build.sh` to run the tests once, or `./watch.sh` to run the tests every time a file changes.

* Use `./build.sh quick` or `./watch.sh quick` to perform an incremental build, and `./clean.sh` to reset the incremental build.

* On Windows, use `build` or `build quick` to perform a build. Use `watch` to run tests every time a file changes.  If you are using gitbash on windows you can use the above mentioned *.sh files which will work and display the output better.

All commands must be run from the repository root.


License
-------

MIT License. See `LICENSE.txt`.