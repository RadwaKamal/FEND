// Get elements 
// Select color input
const color_input = document.getElementById('colorPicker');

// Select size input
const g_height_input = document.getElementById('input_height');
const g_width_input = document.getElementById('input_width');

// Select size picker form 
const size_picker_form = document.getElementById('sizePicker');

// Select grid table
const grid = document.getElementById('pixel_canvas');

// Handle events 
// When size is submitted by the user, call makeGrid()
size_picker_form.onsubmit = function (e) {
	e.preventDefault(); // To prevent page reload
	makeGrid();
};

function makeGrid() {
	// Ensure grid is empty
	grid.innerHTML = "";

	let g_height = g_height_input.value; // Get grid height
	let g_width = g_width_input.value; // Get grid width

	// Add tr to grid
	while (g_height >= 1) {
		// Create tr element and append it to grid 
		let tr = document.createElement("tr");
		grid.appendChild(tr);
		g_height--; // Decrement g_height 
	}

	// Get all inserted tr elements
	let all_tr = document.querySelectorAll("tr");

	// Add td to each tr
	all_tr.forEach(function (tr) {
		for (let td_per_tr = 1; td_per_tr <= g_width; td_per_tr++) {
			// Create td element and append it to tr 
			let td = document.createElement("td");
			tr.appendChild(td);
		}
	});

	// Listen on cell click 
	grid.addEventListener("click", function (e) {
		if (e.target && e.target.nodeName == "TD") {
			let clicked_tr = e.target;
			// Set cell BG color to picked color
			clicked_tr.style.backgroundColor = color_input.value;
		}
	});
}