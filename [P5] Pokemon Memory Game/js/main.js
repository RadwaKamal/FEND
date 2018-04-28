(function () {
	let game = {
		init: function() {
			this.cacheDom();
			this.initializeGameFields();
			this.bindEvents();
		},
		cacheDom: function() {
			// NOTE: Array.from used so i can forEach on a nodelist's children 
			const bar = document.getElementById("bar");
			const main_game = document.getElementById("mainGame");
			this.dom = {
				$bar: bar,
				$bar_imgs: Array.from(bar.children),
				$cards: document.querySelectorAll(".flip-container"),
				$current_rating_imgs: Array.from(document.getElementById("currentRating").children),
				$final_min: document.getElementById("finalMin"),
				$final_rating_imgs: Array.from(document.getElementById("finalRating").children),
				$final_sec: document.getElementById("finalSec"),
				$main_game: main_game,
				$moves_number: document.getElementById("movesNumber"),
				$start_btn: document.getElementById("startBtn"),
				$overlay: document.querySelector(".overlay-box"),
				$play_again: document.getElementById("playAgain"),
				$reset: document.getElementById("resetBtn"),
				$rows: Array.from(main_game.children).slice(1),
				$success_modal: document.getElementById("successModal"),
				$timer_sec: document.getElementById("currentSec"),
				$timer_min: document.getElementById("currentMin")
			};
		},
		heros: ["bullbasaur", "snorlax", "charmander", "meowth", "squirtle", "eevee", "zubat", "pikachu"],
		initializeGameFields: function() {
			this.hero_name = "";
			this.guess_ids = [];
			this.number_of_moves = 0;
			this.correct_matches = 0;
			this.wrong_matches = 0;
			this.click_disabled = false;
			this.interval_id = null;
		},
		bindEvents: function() {
			this.dom.$reset.addEventListener("click", () => {
				this.clickReset();
			});

			this.dom.$start_btn.addEventListener("click", (e) => {
				this.start();
			});

			this.dom.$cards.forEach((card) => {
				card.addEventListener("click", (e) => {
					this.clickCard(card);		
				})	
			});

			this.dom.$play_again.addEventListener("click", () => {
				this.playAgain();		
			});
		},
		start: function(){
			this.resetGame();
			this.dom.$overlay.style.background = "rgba(70, 69, 54, 0)";
			this.dom.$start_btn.firstChild.style.visibility = "hidden";
			this.dom.$start_btn.style.visibility = "hidden";
			window.setTimeout(() => this.dom.$overlay.style.visibility = "hidden", 500);
			this.timer();
		},
		clickCard: function(card) {
			if (this.click_disabled) return;

			// check if card is already flipped
			if (card.classList.contains("flip")) return;

			this.number_of_moves++;
			this.dom.$moves_number.innerHTML = this.number_of_moves;
			card.classList.add("flip");

			let card_img = card.querySelector(".card-img");
			let card_name = card_img.getAttribute("data-name");
			this.guess_ids.push(card_img.id);

			let bar_img = this.dom.$bar.querySelector(`[data-name='${card_name}']`);
			if (bar_img.src.indexOf(`${card_name}`) == -1) {
				bar_img.src = `images/${card_name}.svg`;
				bar_img.classList.add("shake-rotate");
			}

			if (!this.hero_name) {
				this.hero_name = card_name;
			} else if (this.hero_name == card_name) {
				this.hero_name = "";
				this.guess_ids = [];

				// show corresponding pokemon bar img
				bar_img.style.opacity = 1;
				bar_img.classList.remove("shake-rotate");
				bar_img.classList.add("shake-rotate-magnify");

				// user has won the game :tada:
				if (this.correct_matches == 7) {
					this.endGame();
					return;
				}
				this.correct_matches++;
			} else {
				this.click_disabled = true;
				this.wrong_matches++;
				this.hero_name = "";
				window.setTimeout(() => {
					let flip_containers = [];

					this.guess_ids.forEach((id) => {
						let flip_container = document.getElementById(`${id}`).closest(".flip");
						flip_container.classList.add("shake");
						flip_containers.push(flip_container);
					});

					window.setTimeout(() => {
						this.guess_ids.forEach((id) => {
							let flip_container = document.getElementById(`${id}`).closest(".flip");
							flip_container.classList.remove("flip", "shake");
						})
						this.guess_ids = [];
						this.click_disabled = false;
					}, 600);
				}, 200);
				// change rating if required
				this.changeRating();
			}
		},
		playAgain: function(){
			this.resetGame();
			this.dom.$success_modal.style.visibility = "hidden";
			this.dom.$overlay.style.visibility = "hidden";
			this.timer();
		},
		clickReset: function(){
			this.resetGame();
			this.showStartOverlay();
		},
		resetGame: function() {
			// flip again all flipped cards
			let flipped_cards = document.querySelectorAll(".flip");
			if (flipped_cards.length > 0)
				flipped_cards.forEach((card) => card.classList.remove("flip"));

			// reset global game fields
			this.hero_name = "";
			this.guess_ids = [];
			this.correct_matches = 0;
			this.wrong_matches = 0;
			this.number_of_moves = 0;
			this.dom.$moves_number.innerHTML = 0;

			// reassign cards
			window.setTimeout(() => this.randomize(), 250);

			// reset timer
			window.clearInterval(this.interval_id);
			this.dom.$timer_min.innerHTML = "00";
			this.dom.$timer_sec.innerHTML = "00";

			// reset rating
			this.dom.$current_rating_imgs.forEach((img) => img.src = "images/star.svg");

			// reset pokemon bar 
			this.dom.$bar_imgs.forEach((bar_img) => {
				bar_img.style.opacity = 0.4;
				bar_img.src = "images/ultra-ball.svg";
				bar_img.classList.remove("shake-rotate-magnify", "shake-rotate");
			});

			// reset success modal if exists
			this.dom.$success_modal.classList.remove("modal-animate");
	    	this.dom.$success_modal.style.visibility = "hidden";
		},
		showStartOverlay: function() {
			this.dom.$start_btn.style.visibility = "visible";
			this.dom.$start_btn.firstChild.style.visibility = "visible";
			this.dom.$overlay.style.background = "rgba(70, 69, 54, 0.85)";
			this.dom.$overlay.style.visibility = "visible";
		},
		randomize: function() {
			this.heros.sort(() =>  0.5 - Math.random()); // shuffle heros array, compare to rand number
			this.dom.$rows.forEach((row, index) => {
				const images = Array.from(row.querySelectorAll(".card-img"));
				if (index < 2) {
					if (index == 0) {
						this.changeSrcImgs(images);
					} else {
						this.changeSrcImgs(images, 1);
					}
				} else {
					if (index == 2) {
						this.heros.sort(() => Math.random() * 25 - 2.365485845); // shuffle heros array, compare to rand number
						this.changeSrcImgs(images);
					} else {
						this.changeSrcImgs(images, 1);
					}
				}
			})
		},
		changeSrcImgs: function(images, second_half = 0) {
			images.forEach((img, index) => {
				let target_index = second_half ? index : index + 4;
				let new_img_src = `images/${this.heros[target_index]}.svg`
				img.src = new_img_src;
				img.alt = this.heros[target_index];
				img.setAttribute("data-name", this.heros[target_index]);
				// assign id for img, to make it easier to get it after that
				img.id = `${this.heros[target_index]}_${Math.ceil(target_index + 20*Math.random())}_${Math.ceil(10*Math.random())}`;
			});
		},
		timer: function() {
			let start = Date.now();
			this.interval_id = window.setInterval(() => {
				let elapsed_seconds = Math.floor((Date.now() - start) / 1000);
				if (elapsed_seconds > 60) {
					let minutes = Math.floor(elapsed_seconds / 60);
					let seconds = elapsed_seconds % 60;
					// format number to be always of 2 digits
					this.dom.$timer_min.innerHTML = minutes > 9 ? minutes : "0" + minutes;
					this.dom.$timer_sec.innerHTML = seconds > 9 ? seconds : "0" + seconds;
				} else {
					this.dom.$timer_sec.innerHTML = elapsed_seconds > 9 ? elapsed_seconds : "0" + elapsed_seconds;
				}
			}, 1000);
		},
		endGame: function() {
			window.clearInterval(this.interval_id);
			this.dom.$final_min.innerHTML = this.dom.$timer_min.innerHTML;
			this.dom.$final_sec.innerHTML = this.dom.$timer_sec.innerHTML;
			this.dom.$final_rating_imgs.forEach((img, index) => {
				const firstSrc = this.dom.$current_rating_imgs[0].src;
				const scndSrc = this.dom.$current_rating_imgs[1].src;
				const thirdSrc = this.dom.$current_rating_imgs[2].src;
				index == 0 ? img.src = firstSrc : (index == 1 ? img.src = scndSrc : img.src = thirdSrc);
			})
			this.dom.$overlay.style.background = "rgba(70, 69, 54, 0.5)";
			window.setTimeout(() => {
				this.dom.$overlay.style.visibility = "visible";
				this.dom.$success_modal.style.visibility = "visible";
				this.dom.$success_modal.classList.add("modal-animate");
			}, 250);
		},
		changeRating: function() {
			if (this.wrong_matches == 5)
				this.dom.$current_rating_imgs[2].src = "images/empty_star.svg";

			if (this.wrong_matches == 10)
				this.dom.$current_rating_imgs[1].src = "images/empty_star.svg";

			if (this.wrong_matches == 20)
				this.dom.$current_rating_imgs[0].src = "images/empty_star.svg";
		},
		shuffleBarImgs: function() {
			for (let i = this.dom.$bar.children.length; i >= 0; i--) {
				this.dom.$bar.appendChild(this.dom.$bar.children[Math.random() * i | 0]);
			}
		}
	};
	
	game.init();

	// We ignore it for code coverage as it is only here for testing
	if (typeof module !== 'undefined' && module.exports)
		module.exports = {game: game};
	
}())