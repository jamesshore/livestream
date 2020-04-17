// Copyright Titanium I.T. LLC.

"use strict";

const assert = require("./assert.js");
const quixote = require("../vendor/quixote.js");

const WHITESPACE = 25;

describe("Media Object CSS", function() {

	let frame;
	let episode;
	let content;
	let button;
	let title;
	let description;

	before(function(done) {
		frame = quixote.createFrame({
			stylesheet: "/base/src/screen.css"
		}, done);
	});

	beforeEach(function() {
		frame.reset();
		episode = frame.add(
			`<div class='episode' style='background-color:red'>
			  <div class='episode__button'>
			    <img id='icon' src='/base/src/play.png' />
			  </div>
			  <div class='episode__content' style='background-color:blue'>
			    <div class='episode__title'>Episode Title</div>
			    <p class='episode__description'>The episode description.</p>
			  </div>
			</div>`
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


	/*
	 * TODO:
	 * Move episde
	 * Add the date
	 * Make the whole element a link
	 * Semanticize the play button (use `background-image`)?
	 * Center the play button (use CSS grid? background-position? vertical-align (doesn't work with block elements)?)
	 * Fonts
	 * Colors
	 */


});
