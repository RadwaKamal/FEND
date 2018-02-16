const test = require('tape');
const JSDOM = require('jsdom').JSDOM;
const fs = require('fs');

const html = fs.readFileSync(__dirname + '/../index.html', 'utf8');

//JSDOM is a constructor which takes the argument of a HTML file as a string, it will then create a DOM (document object model) in the same way a browser would, and we assign it to the variable 'DOM'
const DOM = new JSDOM(html);

//Here we declare a global variable, node is a little different to the browser, if we want something to be in the global scope (as in, available in other files whilst they are being processed by 'require') then we need to specifically declare that. We do this with the 'document' from the DOM we just created so that it can be used by our JS file.
global.document = DOM.window.document;

global.window = DOM.window;

//Now that we have the document globally we can require in the code from our JS file
const app = require('../js/main.js');
const game = app.game;

test('test initializeGameFields function', function(t) {
	
	game.initializeGameFields();

	const actual_hero_name = game.hero_name;
	t.equal(actual_hero_name, "", 'hero_name should equal to empty string');

	const actual_guess_ids = game.guess_ids;
	t.looseEqual(actual_guess_ids, [], 'guess_ids should equal to empty list');

	const actual_number_of_moves = game.number_of_moves;
	t.equal(actual_number_of_moves, 0, 'number_of_moves should equal to zero');

	const actual_correct_matches = game.correct_matches;
	t.equal(actual_correct_matches, 0, 'correct_matches should equal to zero');

	const actual_wrong_matches = game.wrong_matches;
	t.equal(actual_wrong_matches, 0, 'wrong_matches should equal to zero');

	const actual_click_disabled = game.click_disabled;
	t.false(actual_click_disabled, 'click_disabled should equal to false');

	const actual_interval_id = game.interval_id;
	t.equal(actual_interval_id, null, 'interval_id should equal to null');

	t.end();
  });
  
  test('test cacheDom function', function(t){
	game.cacheDom();
	const actual_cache_dom = game.dom;
	const expected_cache_dom = {
		$bar: document.getElementById("bar"),
		$bar_imgs: Array.from(document.getElementById("bar").children),
		$cards: document.querySelectorAll(".flip-container"),
		$current_rating_imgs: Array.from(document.getElementById("currentRating").children),
		$final_min: document.getElementById("finalMin"),
		$final_rating_imgs: Array.from(document.getElementById("finalRating").children),
		$final_sec: document.getElementById("finalSec"),
		$main_game: document.getElementById("mainGame"),
		$moves_number: document.getElementById("movesNumber"),
		$start_btn: document.getElementById("startBtn"),
		$overlay: document.querySelector(".overlay-box"),
		$play_again: document.getElementById("playAgain"),
		$reset: document.getElementById("resetBtn"),
		$rows: Array.from(document.getElementById("mainGame").children).slice(1),
		$success_modal: document.getElementById("successModal"),
		$timer_sec: document.getElementById("currentSec"),
		$timer_min: document.getElementById("currentMin")
	};

	t.same(actual_cache_dom, expected_cache_dom);

	t.end();
  });

  test('test timer function', function(t){
	
	game.$timer_sec = document.getElementById("currentSec");
	game.$timer_min = document.getElementById("currentMin");  
	  
	game.timer();

	const actual_interval_id = game.interval_id;
	
	setTimeout(() => {
		t.notEqual(actual_interval_id, null, 'interval_id should not be null');
	} ,2000);

	setTimeout(() => {	
		const actual_timer_sec = game.$timer_sec.innerHTML;
		t.notEqual(actual_timer_sec, "00", 'timer test: timer_sec should not be 00');
	} ,3000);

	setTimeout(() => {	
		const actual_timer_min = game.$timer_min.innerHTML;
		t.notEqual(actual_timer_min, "00", 'timer test: timer_min should not be 00');
	} ,65000);

	t.end();
  });

  test('test start function', function(t){
	game.init();

	const start_btn = document.getElementById("startBtn");
	start_btn.click();
	
	const overlay_box = document.querySelector(".overlay-box"); 
	t.equal(overlay_box.style.background, 'rgba(70, 69, 54, 0)', 'overlay box bg should be rgba(70, 69, 54, 0)');

	const actual_start_child_visibility = start_btn.firstChild.style.visibility;
	t.equal(start_btn.firstChild.style.visibility, 'hidden', 'start btn first child visibility should be hidden');

	t.equal(start_btn.style.visibility, 'hidden', 'start btn visibility should be hidden');

	setTimeout(() => {
		t.equal(overlay_box.style.visibility, 'hidden', 'overlay box visibility should be hidden');	
		
		const actual_timer_sec = document.getElementById("currentSec").innerHTML;
		t.notEqual(actual_timer_sec, "00", 'start btn test: timer_sec should not be 00');
	}, 1000);

	const actual_flipped_cards_count = document.querySelectorAll(".flip").length;
	t.equal(actual_flipped_cards_count, 0, 'flipped cards count should be 0');

	const actual_hero_name = game.hero_name;
	t.equal(actual_hero_name, "", 'start btn test: hero_name should equal to empty string');

	t.end();
	
  });

  