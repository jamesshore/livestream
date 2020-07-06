James Shore Live
================

This example code is used in my [Twitch.tv livestream](https://www.twitch.tv/jamesshorelive). See the individual episodes for more information. The episode archive is [available here](https://www.jamesshore.com/Blog/Lunch-and-Learn/).


This Week's Challenge (7 July 2020): How to Fix a Bug
---------------------

This repository contains a simple HTTP server that implements a ROT-13 microservice. See "How the Microservice Works", below, for details.

The service has a bug: it fails with a 404 (not found) error if the URL has a query string. In other words, if you POST to `/rot13/transform?my_query` instead of `/rot13/transform`, the service will return a 404 error. But it should just ignore the query string and work normally.

Your challenge is to fix the code so that the query string is ignored, and to do so in a way that prevents this sort of bug from happening again.


The Thinking Framework
----------------------

(Previous episodes may be helpful. You can find them [here](https://www.jamesshore.com/Blog/Lunch-and-Learn/).)

When fixing a bug, many people think this way:

1. What is the bug? (Reproduce the bug.)
2. Where is the bug? (Find the code that has the bug.)
3. Fix the bug.

But this is incomplete. A better approach is as follows:

1. What is the bug?
2. Where is the bug?
3. **Why is there a bug?**
4. Test, fix, and prevent **this entire category** of bugs.

Fixing an entire category of bugs may seem like a lot to ask, but it's not as hard as it sounds. Step 3 hold the key. When you find the bug, take a moment to consider what allowed it to be introduced. This will tell you how you can prevent this type of bug in the future.

In my experience, bugs can be divided into four types of errors:

* Programmer errors: The code doesn't do what the programmer intended it to do.
* Design errors: The code doesn't do what the programmer intended it to do **and** it's in a part of the codebase that's prone to these sorts of mistakes.
* Requirements errors: The code did exactly what the programmer intended it to do, but it doesn't match what stakeholders expected.
* Systemic errors: The code did what the programmer intended and stakeholders got what they expected, but it had a hidden flaw nobody considered.

After finding a bug, decide which category of error led to the bug. What you do next depends on the category.

**Programmer errors.** Everybody makes mistakes; it's inevitable. There are several techniques that can catch programmer mistakes before they escape the team: test-driven development; pair programming; mob programming; code reviews; and reducing overtime, distractions, and stressors.

**Design errors.** Some parts of the codebase are just more error-prone than others. To reduce these, improve the design. The best way to improve design is to refactor. Automated tests make this easier, and test-driven development makes automated tests easier. To produce higher-quality designs from the beginning, consider evolutionary design, which means starting with a simple design and iteratively revising it as you go. See [this video presentation](https://www.jamesshore.com/In-the-News/Evolutionary-Design-Animated.html) or [this book excerpt](https://www.jamesshore.com/Agile-Book/incremental_design.html) for more about evolutionary design.

**Requirements errors.** Higher quality, more frequent communication with stakeholders is the only way to prevent requirements errors. Although spending more time analyzing and documenting requirements may sound useful, it's usually not; stakeholders have too much trouble understanding what they need until they have something concrete in front of them. Instead, consider techniques such as on-site customers (stakeholder representatives who join your team full-time); monthly or bi-weekly demos of your progress and plans; concrete, stakeholder-written examples of complex business rules; and pairing with stakeholders to iteratively define and refine features.

**Systemetic errors.** Systematic errors are the result of blind spots. By their nature, they're hard to find. Techniques such as exploratory testing can help. Once you've found a systematic error, prevent that type of error from happening again in the future: encoding your new awareness into the system. If you can, modify your design to make that type of error impossible. If that's not possible, add a test or step to your build pipeline that will cause your build to fail if someone accidentally introduces that sort of error again. If that's not possible either, at least modify your process to catch or prevent that sort of error... but only if the cost of additional bugs is less than the overhead of the process changes.


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