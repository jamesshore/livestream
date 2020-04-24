// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert.js");
const quixote = require("../vendor/quixote.js");
const CssHelper = require("./__css_helper.js");

describe("Episode List CSS", function() {

	let frame;
	let cssHelper;

	before(function(done) {
		frame = quixote.createFrame({
			stylesheet: "/base/src/screen.css"
		}, done);
	});

	beforeEach(function() {
		frame.reset();
		cssHelper = new CssHelper(frame);
	});

	function addEpisode(id, episodeList) {
		return episodeList.add(
			`<div id="${id}" class="episode episode--compact">
				<div class="episode__button">
			    <img class='episode__icon' src='/base/src/play.png' />
				</div>
				<div class="episode__content">
					<div class="episode__title">
					  <span class="episode__number">E1</span>
					  <span class="episode__name">Episode Title</span>
					</div>
					<div class="episode__date">
						Thu, 23 Apr ’20 
					</div>
			    <p class='episode__description'>We end Let’s Code JavaScript with a look at how we avoided using mocks and other test doubles. Although test doubles are useful, they’re not without their problems. But we needed to write unit tests, not integration tests. How did we do it? It’s a tough problem, but we came up with a novel—and practical!—solution.</p>
				</div>
			</div>`
		);
	}

	function createEpisodeList() {
		const container = frame.add(
			`<div style='width: 750px;'></div>`
		);
		const episodeList = container.add(
			`<div class="episode_list"><div>`
		);
		addEpisode("episode1", episodeList);
		addEpisode("episode2", episodeList);
		addEpisode("episode3", episodeList);

		return {
			episodeList,
			episode: frame.get("#episode2"),
			button: frame.get("#episode2 .episode__button"),
			icon: frame.get("#episode2 .episode__icon"),
			title: frame.get("#episode2 .episode__title"),
			number: frame.get("#episode2 .episode__number"),
			name: frame.get("#episode2 .episode__name"),
			date: frame.get("#episode2 .episode__date"),
			description: frame.get("#episode2 .episode__description"),
		};
	}

	it("has rounded corners", function() {
		const { episodeList } = createEpisodeList();

		cssHelper.assertBorderRadius(episodeList, "3px");
		cssHelper.assertOverflowHidden(episodeList);
	});

	it("has a drop shadow", function() {
		const { episodeList } = createEpisodeList();

		cssHelper.assertBoxShadow(episodeList, cssHelper.DROP_SHADOW);
	});

	describe("compact episode", function() {

		it("does not have rounded corners", function() {
			const { episode } = createEpisodeList();

			cssHelper.assertBorderRadius(episode, "0px");
			cssHelper.assertBoxShadow(episode, "none");
		});

		it("has a white background", function() {
			const { episode } = createEpisodeList();

			cssHelper.assertBackgroundColor(episode, cssHelper.CONTENT_BACKGROUND);
		});

		it("doesn't show description", function() {
			const { description } = createEpisodeList();

			description.render.should.equal(false);
		});

		it("has button on left side", function() {
			const { episodeList, episode, button, icon } = createEpisodeList();

			button.top.should.equal(episode.top);
			button.bottom.should.equal(episode.bottom);

			button.left.should.equal(episodeList.left);
			button.width.should.equal(icon.width.plus(cssHelper.WHITESPACE * 2));

			cssHelper.assertBackgroundColor(button, cssHelper.BACKGROUND_BLUE);
		});

		it("has an icon in the center of the button", function() {
			const { icon, button } = createEpisodeList();

			icon.width.should.equal(20);
			icon.center.should.equal(button.center);
			icon.middle.should.equal(button.middle);
		});

		it("has an episode number to the right of the button", function() {
			const { number, button, episode } = createEpisodeList();

			number.left.should.equal(button.right.plus(cssHelper.WHITESPACE));
		});

		it("centers episode number in the middle of the episode", function() {
			const { number, episode } = createEpisodeList();

			number.middle.should.equal(episode.middle);
		});

		it("puts episode name to right of episode number", function() {
			const { name, number, episode } = createEpisodeList();

			name.left.should.equal(number.right.plus(cssHelper.WHITESPACE / 2));
		});

		it("puts episode date at right side of episode block", function() {
			const { date, episode, name, title } = createEpisodeList();

			date.left.should.equal(title.right.plus(cssHelper.WHITESPACE));
			date.right.should.equal(episode.right.minus(cssHelper.WHITESPACE));
			date.bottom.should.equal(title.bottom);
		});

		it("has vertical padding focused on the title", function() {
			const { title, episode } = createEpisodeList();

			title.top.should.equal(episode.top.plus(cssHelper.WHITESPACE));
			title.bottom.should.equal(episode.bottom.minus(cssHelper.WHITESPACE));
		});

	});

});


/*
 * TODO:
 *
 * Factor common constants?
 *  button width
 *  cssHelper.WHITESPACE
 *  icon width
 * Use CSS variables and functions?
 * Automatically handle regular episode inside episode_list?
 * Extract 'box' element instead of having it be part of episode
 */