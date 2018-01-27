'use strict';

// cards images names
const heros = ["bullbasaur", "snorlax", "charmander", "meowth", "squirtle", "eevee", "zubat", "pikachu"];

// NOTE: Array.from used so i can forEach on a nodelist's children 

// required dom elements
const start_btn = document.getElementById("startBtn");
const main_game = document.getElementById("mainGame");
const moves_number = document.getElementById("movesNumber");
const reset = document.getElementById("resetBtn");
const timer_sec = document.getElementById("currentSec");
const timer_min = document.getElementById("currentMin");
const final_sec = document.getElementById("finalSec");
const final_min = document.getElementById("finalMin");
const play_again = document.getElementById("playAgain");
const bar = document.getElementById("bar");
const bar_imgs = Array.from(bar.children);
const current_rating_imgs = Array.from(document.getElementById("currentRating").children);
const final_rating_imgs = Array.from(document.getElementById("finalRating").children);
const success_modal = document.getElementById("successModal");
const cards = document.querySelectorAll(".flip-container");
const overlay = document.querySelector(".overlay-box");
const rows = Array.from(main_game.children).slice(1);

// global game fields
let hero_name = "";
let guess_ids = [];
let number_of_moves = 0;
let correct_matches = 0;
let wrong_matches = 0;
let click_disabled = false;
let interval_id;

// add event listeners

reset.addEventListener("click", () => {
    resetGame();
    showStartOverlay();
});

start_btn.addEventListener("click", (e) => {
    resetGame();
    overlay.style.background = "rgba(70, 69, 54, 0)";
    start_btn.firstChild.style.visibility = "hidden";
    start_btn.style.visibility = "hidden";
    window.setTimeout(() => overlay.style.visibility = "hidden", 500);
	timer();
});

cards.forEach((card) => {
    card.addEventListener("click", (e) => {

        if (click_disabled) return;

        // check if card is already flipped
        if (card.classList.contains("flip")) return;

        number_of_moves++;
        moves_number.innerHTML = number_of_moves;
        card.classList.add("flip");

        let card_img = card.querySelector(".card-img");
        let card_name = card_img.getAttribute("data-name");
        guess_ids.push(card_img.id);

		let bar_img = bar.querySelector(`[data-name='${card_name}']`);
		if (bar_img.src.indexOf(`${card_name}`) == -1) {
			bar_img.src = `images/${card_name}.svg`;	
			bar_img.classList.add("shake-rotate");
		}	
		
        if (!hero_name) {
			hero_name = card_name;
        } else if (hero_name == card_name) {
            hero_name = "";
			guess_ids = [];
			
            // show corresponding pokemon bar img
			bar_img.style.opacity = 1;
			bar_img.classList.remove("shake-rotate");
            bar_img.classList.add("shake-rotate-magnify");

            // user has won the game :tada:
            if (correct_matches == 7) {
                endGame();
                return;
            }
            correct_matches++;
        } else {
            click_disabled = true;
			wrong_matches++;
            hero_name = "";
            window.setTimeout(() => {
				let flip_containers = [];
				guess_ids.forEach((id) => {
					let flip_container = document.getElementById(`${id}`).closest(".flip");
					flip_container.classList.add("shake");
					flip_containers.push(flip_container);
				});
				window.setTimeout(() => {
					guess_ids.forEach((id) => {
						let flip_container = document.getElementById(`${id}`).closest(".flip");
						flip_container.classList.remove("flip", "shake");
					})
					guess_ids = [];
					click_disabled = false;
			}, 600);
		}, 200);

		// change rating if required
		changeRating();
        }
    })
});

play_again.addEventListener("click", () => {
    resetGame();
    success_modal.style.visibility = "hidden";
    overlay.style.visibility = "hidden";
    timer();
});

// functions definitions

let resetGame = () => {
    // flip again all flipped cards
    let flipped_cards = document.querySelectorAll(".flip");
    if (flipped_cards.length > 0) {
        flipped_cards.forEach((card) => card.classList.remove("flip"));
    }

    // reset global game fields
    hero_name = "";
    guess_ids = [];
    correct_matches = 0;
    wrong_matches = 0;
    number_of_moves = 0;
    moves_number.innerHTML = number_of_moves;

    // reassign cards
    window.setTimeout(() => randomize(), 250);
    
    // reset timer
    window.clearInterval(interval_id);
    timer_min.innerHTML = "00";
    timer_sec.innerHTML = "00";

    // reset rating
    current_rating_imgs.forEach((img) => img.src = "images/star.svg");

    // reset pokemon bar 
    bar_imgs.forEach((bar_img) => {
			bar_img.style.opacity = 0.4;
			bar_img.src = "images/ultra-ball.svg";
			bar_img.classList.remove("shake-rotate-magnify", "shake-rotate");
		});
		
	shuffleBarImgs();

    // remove animation class from success modal if exists
    success_modal.classList.remove("modal-animate");
}

let showStartOverlay = () => {
    start_btn.style.visibility = "visible";
    start_btn.firstChild.style.visibility = "visible";
    overlay.style.background = "rgba(70, 69, 54, 0.85)";
    overlay.style.visibility = "visible";
}

let randomize = () => {
    heros.sort(() => 0.5 - Math.random()); // shuffle heros array, compare to rand number
    rows.forEach((row, index) => {
        const images = Array.from(row.querySelectorAll(".card-img"));
        if (index < 2) {
            if (index == 0) {
                changeSrcImgs(images);
            } else {
                changeSrcImgs(images, 1);
            }
        } else {
            if (index == 2) {
                heros.sort(() => Math.random()*25 - 2.365485845); // shuffle heros array, compare to rand number
                changeSrcImgs(images);
            } else {
                changeSrcImgs(images, 1);
            }
        }
    })
}

let changeSrcImgs = (images, second_half = 0) => {
    images.forEach((img, index) => {
        let target_index = second_half ? index : index + 4;
        let new_img_src = `images/${heros[target_index]}.svg`
        img.src = new_img_src;
        img.alt = heros[target_index];
        img.setAttribute("data-name", heros[target_index]);
        // assign id for img, to make it easier to get it after that
        img.id = `${heros[target_index]}_${Math.ceil(target_index + 20*Math.random())}_${Math.ceil(10*Math.random())}`;
    });
}

let timer = () => {
    let start = Date.now();
    interval_id = window.setInterval(() => {
		let elapsed_seconds = Math.floor((Date.now() - start) / 1000);
		if (elapsed_seconds > 60) {
			let minutes = Math.floor(elapsed_seconds / 60);
			let seconds = elapsed_seconds % 60;
			// format number to be always of 2 digits
			timer_min.innerHTML = minutes > 9 ? minutes : "0" + minutes;
			timer_sec.innerHTML = seconds > 9 ? seconds : "0" + seconds;
		} else {
			timer_sec.innerHTML = elapsed_seconds > 9 ? elapsed_seconds : "0" + elapsed_seconds;
		}
    }, 1000);
}

let endGame = () => {
    window.clearInterval(interval_id);
    final_min.innerHTML = timer_min.innerHTML;
    final_sec.innerHTML = timer_sec.innerHTML;
    final_rating_imgs.forEach((img, index) => {
        const firstSrc = current_rating_imgs[0].src;
        const scndSrc = current_rating_imgs[1].src;
        const thirdSrc = current_rating_imgs[2].src;
        index == 0 ? img.src = firstSrc : (index == 1 ? img.src = scndSrc : img.src = thirdSrc);
    })
    overlay.style.background = "rgba(70, 69, 54, 0.5)";
    window.setTimeout(() => {
        overlay.style.visibility = "visible";
        success_modal.style.visibility = "visible";
        success_modal.classList.add("modal-animate");
    }, 250);
}

let changeRating = () => {
    if (wrong_matches == 5) 
        current_rating_imgs[2].src = "images/empty_star.svg";

    if (wrong_matches == 10)
        current_rating_imgs[1].src = "images/empty_star.svg";

    if (wrong_matches == 20)
        current_rating_imgs[0].src = "images/empty_star.svg";
}

let shuffleBarImgs = () => {
	for (let i = bar.children.length; i >= 0; i--) {
		bar.appendChild(bar.children[Math.random() * i | 0]);
	}
}