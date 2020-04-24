// Copyright Titanium I.T. LLC.

"use strict";

const assert = require("./assert.js");
const quixote = require("../vendor/quixote.js");
const CssHelper = require("./__css_helper.js");

const WHITESPACE = 25;
const BUTTON_BACKGROUND = "rgb(65, 169, 204)";
const CONTENT_BACKGROUND = "rgb(255, 255, 255)";
const DROP_SHADOW = "rgba(0, 0, 0, 0.2) 0px 1px 2px 0px";

describe("Episode CSS", function() {

	let frame;
	let cssHelper;

	before(function(done) {
		frame = quixote.createFrame({
			stylesheet: "/base/src/screen.css"
		}, done);
	});

	beforeEach(function() {
		frame.reset();
		cssHelper = new CssHelper();
	});

	function createEpisode() {
		const container = frame.add(
			`<div style='width: 750px;'></div>`
		);
		const episode = container.add(
			`<div class='episode'>
			  <div class='episode__button'>
			    <img class='episode__icon' src='/base/src/play.png' />
			  </div>
			  <div class='episode__content'>
			    <div class='episode__title'>Episode Title</div>
			    <div class='episode__date'>Fri, 17 Apr ’20</div>
			    <p class='episode__description'>We end Let’s Code JavaScript with a look at how we avoided using mocks and other test doubles. Although test doubles are useful, they’re not without their problems. But we needed to write unit tests, not integration tests. How did we do it? It’s a tough problem, but we came up with a novel—and practical!—solution.</p>
		    </div>
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

	it("has rounded corners", function() {
		const { episode } = createEpisode();

		cssHelper.assertBorderRadius(episode, "5px");
		cssHelper.assertOverflowHidden(episode);
	});

	it("has a drop shadow", function() {
		const { episode } = createEpisode();

		cssHelper.assertBoxShadow(episode, DROP_SHADOW);
	});

	it("fills its container", function() {
		const { episode, container } = createEpisode();

		episode.top.should.equal(container.top);
		episode.bottom.should.equal(container.bottom);
		episode.left.should.equal(container.left);
		episode.right.should.equal(container.right);
	});

	it("has a white background", function() {
		const { episode } = createEpisode();

		cssHelper.assertBackgroundColor(episode, CONTENT_BACKGROUND);
	});

	it("has a button", function() {
		const { button, icon, episode } = createEpisode();

		button.top.should.equal(episode.top);
		button.bottom.should.equal(episode.bottom);

		button.left.should.equal(episode.left);
		button.width.should.equal(icon.width.plus(WHITESPACE * 2));

		cssHelper.assertBackgroundColor(button, BUTTON_BACKGROUND);

		icon.center.should.equal(button.center);
		icon.middle.should.equal(button.middle);
	});

	it("has a title", function() {
		const { title, episode, button } = createEpisode();

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

});
