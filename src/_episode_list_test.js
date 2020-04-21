// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert.js");
const quixote = require("../vendor/quixote.js");

const WHITESPACE = 25;

describe("Episode List CSS", function() {

	let frame;

	before(function(done) {
		frame = quixote.createFrame({
			stylesheet: "/base/src/screen.css"
		}, done);
	});

	beforeEach(function() {
		frame.reset();
	});

	function createEpisodeList() {
		const container = frame.add(
			`<div style='width: 750px;'></div>`
		);
		const episodeList = container.add(
			`<div class="episode_list"> 
				<div class="episode_list__episode" style="background-color:red">
					<div class="episode_list__button" style="background-color:blue">
				    <img class='episode_list__icon' src='/base/src/play.png' />
					</div>
					<div class="episode_list__content">
						<div class="episode_list__info" style="background-color:green">
						  <span class="episode_list__number">E1</span>
						  <span class="episode_list__title">E1</span>
						</div>
						<div class="episode_list__date" style="background-color:purple">
							E1 
						</div>
					</div>
				</div>
			</div>`
		);

		return {
			episodeList,
			episode: frame.get(".episode_list__episode"),
			button: frame.get(".episode_list__button"),
			icon: frame.get(".episode_list__icon"),
			info: frame.get(".episode_list__info"),
			number: frame.get(".episode_list__number"),
			title: frame.get(".episode_list__title"),
			date: frame.get(".episode_list__date"),
		};
	}

	it("has button on left side", function() {
		const { episodeList, episode, button, icon } = createEpisodeList();

		button.top.should.equal(episode.top);
		button.bottom.should.equal(episode.bottom);

		button.left.should.equal(episodeList.left);
		button.width.should.equal(icon.width.plus(WHITESPACE * 2));
	});

	it("has an icon in the center of the button", function() {
		const { icon, button } = createEpisodeList();

		icon.width.should.equal(20);
		icon.center.should.equal(button.center);
		icon.middle.should.equal(button.middle);
	});

	it("has an episode number to the right of the button", function() {
		const { number, button, episode } = createEpisodeList();

		number.left.should.equal(button.right.plus(WHITESPACE));
	});

	it("centers episode number in the middle of the episode", function() {
		const { number, episode } = createEpisodeList();

		number.middle.should.equal(episode.middle);
	});

	it("puts episode title to right of episode number", function() {
		const { title, number, episode } = createEpisodeList();

		title.left.should.equal(number.right.plus(WHITESPACE / 2));
	});

	it("puts episode date at right side of episode block", function() {
		const { date, episode, title, info } = createEpisodeList();

		date.left.should.equal(info.right.plus(WHITESPACE));
		date.right.should.equal(episode.right.minus(WHITESPACE));
		date.bottom.should.equal(title.bottom);
	});

	it("has vertical padding focused on the title", function() {
		const { title, episode } = createEpisodeList();

		title.top.should.equal(episode.top.plus(WHITESPACE));
		title.bottom.should.equal(episode.bottom.minus(WHITESPACE));
	});

});


/*
 * TODO:
 *
 * Factor common constants?
 *  button width
 *  WHITESPACE
 *  icon width
 * Use CSS variables and functions?
 * Refactor episode_list into a modifier of episode? Or maybe episode_list__episode
 */