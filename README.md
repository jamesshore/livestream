James Shore Live
================

This example code was used in my [Tuesday Lunch & Learn](https://www.jamesshore.com/v2/projects/lunch-and-learn) series. See that link for for more information and an archive of past episodes.

Use the tags in this repo to see the code for specific episodes. For example `2020-09-29` has the code for the beginning of the September 29th episode, and `2020-09-29-end` has the code for the end of the episode.


Running the Code
----------------

To run the code in this repository, install [Node.js](http://nodejs.org). Make sure you have version 14 or higher. Then:

* Run `./run.sh [text]` to run the command-line application.

* Run `./build.sh` to lint and test the code once, or `./watch.sh` to do so every time a file changes.

* Use `./build.sh quick` or `./watch.sh quick` to perform an incremental build, and `./clean.sh` to reset the incremental build.

* On Windows, use the .cmd versions: `run` instead of `./run.sh`, `watch` instead of `./watch.sh`, etc. If you're using gitbash, the .sh versions will also work, and they display the output better.

All commands must be run from the repository root.


License
-------

MIT License. See `LICENSE.txt`.