// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert.js");
const quixote = require("../vendor/quixote.js");
const CssHelper = require("./__css_helper.js");

describe("Playlist CSS", function() {

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

	function addEpisode(id, playlist) {
		return playlist.add(
			`<div id="${id}" class="playlist__episode">
				<div class="playlist__button">
			    <img class='playlist__icon' src='/base/src/play.png' />
				</div>
				<div class="playlist__content">
					<div class="playlist__title">
					  <span class="playlist__number">E1</span>
					  <span class="playlist__name">Episode Title</span>
					</div>
					<div class="playlist__date">
						Thu, 23 Apr ’20 
					</div>
			    <p class='playlist__description'>We end Let’s Code JavaScript with a look at how we avoided using mocks and other test doubles. Although test doubles are useful, they’re not without their problems. But we needed to write unit tests, not integration tests. How did we do it? It’s a tough problem, but we came up with a novel—and practical!—solution.</p>
				</div>
			</div>`
		);
	}

	function createPlaylist(playlistClasses) {
		const container = frame.add(
			`<div style='width: 750px;'></div>`
		);
		const playlist = container.add(
			`<div class="${playlistClasses}"><div>`
		);

		addEpisode("episode1", playlist);
		addEpisode("episode2", playlist);
		addEpisode("episode3", playlist);

		return {
			container,
			playlist,
			episode: frame.get("#episode1"),
			episode2: frame.get("#episode2"),
			button: frame.get("#episode1 .playlist__button"),
			icon: frame.get("#episode1 .playlist__icon"),
			title: frame.get("#episode1 .playlist__title"),
			number: frame.get("#episode1 .playlist__number"),
			name: frame.get("#episode1 .playlist__name"),
			date: frame.get("#episode1 .playlist__date"),
			description: frame.get("#episode1 .playlist__description"),
		};
	}

	function createStandardPlaylist() {
		return createPlaylist("playlist");
	}

	function createCompactPlaylist() {
		return createPlaylist("playlist playlist--compact");
	}


	describe.only("Standard playlist", function() {

		it("does not have rounded corners", function() {
			const { playlist } = createStandardPlaylist();

			cssHelper.assertBorderRadius(playlist, "0px");
		});

		it("does not have a drop shadow", function() {
			const { playlist } = createStandardPlaylist();

			cssHelper.assertBoxShadow(playlist, "none");
		});

		it("puts some whitespace between episodes", function() {
			const { episode, episode2 } = createStandardPlaylist();

			episode2.top.should.equal(episode.bottom.plus(15));
		});

	});

	describe("Standard playlist episodes", function() {

		it("has rounded corners", function() {
			const { episode } = createStandardPlaylist();

			cssHelper.assertBorderRadius(episode, "5px");
			cssHelper.assertOverflowHidden(episode);
		});

		it("has a drop shadow", function() {
			const { episode } = createStandardPlaylist();

			cssHelper.assertBoxShadow(episode, cssHelper.DROP_SHADOW);
		});

		it("has a white background", function() {
			const { episode } = createStandardPlaylist();

			cssHelper.assertBackgroundColor(episode, cssHelper.CONTENT_BACKGROUND);
		});

		it("has a button", function() {
			const { button, icon, episode } = createStandardPlaylist();

			button.top.should.equal(episode.top);
			button.bottom.should.equal(episode.bottom);

			button.left.should.equal(episode.left);
			button.width.should.equal(icon.width.plus(cssHelper.WHITESPACE * 2));

			cssHelper.assertBackgroundColor(button, cssHelper.BACKGROUND_BLUE);

			icon.center.should.equal(button.center);
			icon.middle.should.equal(button.middle);
		});

		it("has a title", function() {
			const { title, episode, button } = createStandardPlaylist();

			title.top.should.equal(episode.top.plus(cssHelper.WHITESPACE));
			title.left.should.equal(button.right.plus(cssHelper.WHITESPACE));
		});

		it("has a date", function() {
			const { date, title, episode } = createStandardPlaylist();

			date.top.should.equal(title.top);
			date.right.should.equal(episode.right.minus(cssHelper.WHITESPACE));
		});

		it("has a description", function() {
			const { episode, description, title, button, content } = createStandardPlaylist();

			description.top.should.equal(title.bottom.plus(cssHelper.WHITESPACE));
			description.bottom.should.equal(episode.bottom.minus(cssHelper.WHITESPACE));
			description.left.should.equal(button.right.plus(cssHelper.WHITESPACE));
			description.right.should.equal(episode.right.minus(cssHelper.WHITESPACE));
		});

	});


	describe("compact playlist", function() {

		it("has rounded corners", function() {
			const { playlist } = createCompactPlaylist();

			cssHelper.assertBorderRadius(playlist, "3px");
			cssHelper.assertOverflowHidden(playlist);
		});

		it("has a drop shadow", function() {
			const { playlist } = createCompactPlaylist();

			cssHelper.assertBoxShadow(playlist, cssHelper.DROP_SHADOW);
		});

		it("has no whitespace between episodes", function() {
			const { episode, episode2 } = createCompactPlaylist();

			episode2.top.should.equal(episode.bottom);
		});

	});


	describe("compact playlist episodes", function() {

		it("does not have rounded corners", function() {
			const { episode } = createCompactPlaylist();

			cssHelper.assertBorderRadius(episode, "0px");
			cssHelper.assertBoxShadow(episode, "none");
		});

		it("has a white background", function() {
			const { episode } = createCompactPlaylist();

			cssHelper.assertBackgroundColor(episode, cssHelper.CONTENT_BACKGROUND);
		});

		it("doesn't show description", function() {
			const { description } = createCompactPlaylist();

			description.render.should.equal(false);
		});

		it("has button on left side", function() {
			const { playlist, episode, button, icon } = createCompactPlaylist();

			button.top.should.equal(episode.top);
			button.bottom.should.equal(episode.bottom);

			button.left.should.equal(playlist.left);
			button.width.should.equal(icon.width.plus(cssHelper.WHITESPACE * 2));

			cssHelper.assertBackgroundColor(button, cssHelper.BACKGROUND_BLUE);
		});

		it("has an icon in the center of the button", function() {
			const { icon, button } = createCompactPlaylist();

			icon.width.should.equal(20);
			icon.center.should.equal(button.center);
			icon.middle.should.equal(button.middle);
		});

		it("has an episode number to the right of the button", function() {
			const { number, button, episode } = createCompactPlaylist();

			number.left.should.equal(button.right.plus(cssHelper.WHITESPACE));
		});

		it("centers episode number in the middle of the episode", function() {
			const { number, episode } = createCompactPlaylist();

			number.middle.should.equal(episode.middle);
		});

		it("puts episode name to right of episode number", function() {
			const { name, number, episode } = createCompactPlaylist();

			name.left.should.equal(number.right.plus(cssHelper.WHITESPACE / 2));
		});

		it("puts episode date at right side of episode block", function() {
			const { date, episode, name, title } = createCompactPlaylist();

			date.left.should.equal(title.right.plus(cssHelper.WHITESPACE));
			date.right.should.equal(episode.right.minus(cssHelper.WHITESPACE));
			date.bottom.should.equal(title.bottom);
		});

		it("has vertical padding focused on the title", function() {
			const { title, episode } = createCompactPlaylist();

			title.top.should.equal(episode.top.plus(cssHelper.WHITESPACE));
			title.bottom.should.equal(episode.bottom.minus(cssHelper.WHITESPACE));
		});

	});

});


/*
 * TODO:
 *
 * Automatically handle regular episode inside episode_list?
 *
 */