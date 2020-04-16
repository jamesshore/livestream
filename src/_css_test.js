// Copyright (c) 2015 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.

// Example Quixote unit tests. We're using Mocha as our test framework and Chai for assertions.
// These tests check the our media object CSS, which is defined in `screen.css`.

(function() {
	"use strict";

	var assert = require("./assert.js");
	var quixote = require("../vendor/quixote.js");

	var WHITESPACE = 25;

	describe("Media Object CSS", function() {

		var frame;
		var episode;
		var content;
		var button;
		var title;
		var description;

		before(function(done) {
			frame = quixote.createFrame({
				stylesheet: "/base/src/screen.css"
			}, done);
		});

		beforeEach(function() {
			frame.reset();

			episode = frame.add(
				"<div class='episode' style='background-color:red'>" +
				"  <div class='episode__button'>" +
				"    <img src='/base/src/icon.svg' />" +
				"  </div>" +
				"  <div class='episode__content' style='background-color:blue'>" +
				"    <div class='episode__title'>Episode Title</div>" +
				"    <p class='episode__description'>The episode description.</p>" +
				"  </div>" +
				"</div>"
			);

			button = frame.get(".episode__button");
			content = frame.get(".episode__content");
			title = frame.get(".episode__title");
			description = frame.get(".episode__description");
		});

		it("has an icon", function() {
			button.top.should.equal(episode.top);
			button.left.should.equal(episode.left);
			button.width.should.equal(20);
		});

		it("has a content area", function() {
			content.top.should.equal(episode.top);
			content.left.should.equal(button.right.plus(WHITESPACE));
		});

		it("has a title", function() {
			title.top.should.equal(content.top.plus(WHITESPACE));
			title.left.should.equal(content.left);
		});

		it("has a description", function() {
			description.top.should.equal(title.bottom.plus(WHITESPACE));
			description.left.should.equal(button.right.plus(WHITESPACE));
			description.bottom.should.equal(content.bottom.minus(WHITESPACE));
		});


		// TODO: Make the whole element a link



		// it("positions figure flush to the left of its container", function() {
		// 	figure.left.should.equal(frame.body().left);
		// });
		//
		// it("aligns top edge of figure and content", function() {
		// 	content.top.should.equal(figure.top);
		// });
		//
		// it("positions content to right of figure", function() {
		// 	content.left.should.equal(figure.right.plus(10));
		// });
		//
		// it("positions subsequent elements below media object", function() {
		// 	var subsequent = frame.add("<div>subsequent element</div>", "subsequent");
		//
		// 	subsequent.left.should.equal(frame.body().left);
		//
		// 	subsequent.top.should.equal(figure.bottom);
		// });
		//
		// it("allows elements' margins to extend outside media object", function() {
		// 	content.toDomElement().style.marginTop = "15px";
		// 	content.top.should.equal(figure.top);
		// });

	});

}());