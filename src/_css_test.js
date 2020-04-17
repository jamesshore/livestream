// Copyright Titanium I.T. LLC.

"use strict";

const assert = require("./assert.js");
const quixote = require("../vendor/quixote.js");

const WHITESPACE = 25;

describe("Media Object CSS", function() {

	let frame;

	before(function(done) {
		frame = quixote.createFrame({
			stylesheet: "/base/src/screen.css"
		}, done);
	});

	beforeEach(function() {
		frame.reset();
	});

	function createEpisode() {
		const container = frame.add(
			`<div style='width:500px'></div>`
		);
		const episode = container.add(
			`<div class='episode' style='background-color:red'>
			  <div class='episode__button' style='background-color:green'>
			    <img class='episode__icon' src='/base/src/play.png' />
			  </div>
		    <div class='episode__title' style='background-color:blue'>Episode Title</div>
		    <div class='episode__date' style='background-color:yellow'>Fri, 17 Apr ’20</div>
		    <p class='episode__description' style='background-color:purple'>The episode description.</p>
			</div>`
		);

		return {
			container,
			episode,
			button: frame.get(".episode__button"),
			icon: frame.get(".episode__icon"),
			title: frame.get(".episode__title"),
			date: frame.get(".episode__date"),
			description: frame.get(".episode__description"),
		};
	}

	it("fills its container", function() {
		const { episode, container } = createEpisode();

		episode.top.should.equal(container.top);
		episode.bottom.should.equal(container.bottom);
		episode.left.should.equal(container.left);
		episode.right.should.equal(container.right);
	});

	it("has an icon", function() {
		const { button, icon, episode } = createEpisode();

		button.top.should.equal(episode.top);
		button.bottom.should.equal(episode.bottom);

		button.left.should.equal(episode.left);
		button.width.should.equal(icon.width.plus(WHITESPACE * 2));

		icon.center.should.equal(button.center);
		icon.middle.should.equal(button.middle);
	});

	it("has a title", function() {
		const { title, content, episode, button } = createEpisode();

		title.top.should.equal(episode.top.plus(WHITESPACE));
		title.left.should.equal(button.right.plus(WHITESPACE));
	});

	it("has a date", function() {
		const { date, title, episode } = createEpisode();

		date.top.should.equal(title.top);
		date.right.should.equal(episode.right.minus(WHITESPACE));
	});

	it("has a description", function() {
		const { episode, description, title, button, content } = createEpisode();

		description.top.should.equal(title.bottom.plus(WHITESPACE));
		description.bottom.should.equal(episode.bottom.minus(WHITESPACE));
		description.left.should.equal(button.right.plus(WHITESPACE));
		description.right.should.equal(episode.right.minus(WHITESPACE));
	});


	/*
	 * TODO:
	 * Center the play button
	 * Ensure layout resizes
	 * Fonts
	 * Colors
	 * Make the whole element a link
	 */


});
