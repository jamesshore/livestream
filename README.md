James Shore Live
================

This example code is used in my [livestream](https://www.jamesshore.com/Blog/Lunch-and-Learn/). See the individual episodes for more information.


This Week's Challenge
---------------------

Write a simple scoring tool for the [Cribbage card game](http://www.cribbage.org/NewSite/rules/rule1.asp) that can be run from the command-line, like this:

```sh
$ ./run.sh JH5D5S5C5H
29
```

(On Windows, use `run` instead of `./run.sh`.)

That command means "score a hand consisting of Jack of Hearts, 5 of Diamonds, 5 of Spades, and 5 of Clubs, with the 5 of Hearts as the starter card." (This happens to be the highest-scoring hand in Cribbage.) Each card is represented by a pair of characters.

1. The first character is the rank of the card, with '0' representing '10': A, 2, 3, 4, 5, 6, 7, 8, 9, 0, J, Q, K.
2. The second character is the suit of the card: H, S, D, C referring to Hearts, Spades, Diamonds, and Clubs respectively.

Unless you change `src/cli`, which you aren't expected to, `./run.sh` will call the `analyze()` function in `src/score.js` and pass in the first command-line parameter. What happens after that is up to you.

See below for Cribbage's scoring rules.


Running the Code
----------------

To run the code in this repository, install [Node.js](http://nodejs.org). Then:

* Run `./run.sh` to run the tool manually.

* Run `./build.sh` to lint and test the code once, or `./watch.sh` to do so every time a file changes.

* Use `./build.sh quick` or `./watch.sh quick` to perform an incremental build, and `./clean.sh` to reset the incremental build.

* On Windows, use the .cmd versions: `build` instead of `./build.sh`, `watch` instead of `./watch.sh`, etc. If you are using gitbash, the .sh versions will also work, and they display the output better.

All commands must be run from the repository root.


Cribbage Scoring Rules
----------------------

Cribbage scoring is based on a hand of four cards plus a "starter" card. The score is calculated by finding all combinations of cards that meet the following criteria:

* Pair of cards: 2 points
* Straight of three cards or more: 1 point per card
	* Aces are low, so A, 2, 3 is a valid straight, but Q, K, A is not.
* 4-card flush excluding starter card: 4 points
* 5-card flush including starter card: 5 points
* Jack in the hand whose suit matches the starter card's suit: 1 point
* Card values that add up to 15: 2 points
	* Aces' values are 1.
	* Jacks, Queens, and Kings' values are 10.
	* All other cards' values are equal to their numbers.
	* Example: King + Ace + 4 = 10 + 1 + 4 = 15.

Every unique combination of cards can be used. For example, a hand consisting of 7 of Hearts, 8 of Spades, 8 of Hearts, 8 of Diamonds, with a starter card of 9 of Clubs can be scored as follows:

* 8 of Spades + 8 of Hearts: pair (2 points)
* 8 of Spades + 8 of Diamonds: pair (2 points)
* 8 of Hearts + 8 of Diamonds: pair (2 points)
* 7 of Hearts + 8 of Spades + 9 of Clubs: straight (3 points)
* 7 of Hearts + 8 of Hearts + 9 of Clubs: straight (3 points)
* 7 of Hearts + 8 of Diamonds + 9 of Clubs: straight (3 points)
* 7 of Hearts + 8 of Spades: adds up to 15 (2 points)
* 7 of Hearts + 8 of Hearts: adds up to 15 (2 points)
* 7 of Hearts + 8 of Diamonds: adds up to 15 (2 points)

Total score: 21 (A very good hand!)

However, subsets of straights and flushes may only be counted once. In other words, a four-card straight is only worth three points; it doesn't get counted as a three-card straight *and* a four-card straight. Same for flushes. For example, a hand consisting of 2, 3, 4, and 5 of Hearts, with a starter card of 6 of Hearts, would be scored as follows:

* 2, 3, 4, 5, 6 of Hearts: straight (5 points)
* 2, 3, 4, 5, 6 of Hearts: flush (5 points)
* 2, 3, 4, 6 of Hearts: adds up to 15 (2 points)
* 4, 5, 6 of Hearts: adds up to 15 (2 points)

Total score: 14 (A good score, but not as amazing as you might expect from a straight flush.)


License
-------

MIT License. See `LICENSE.txt`.