const Vehicle = require('./lib/vehicle') 
const Player = require('./lib/player') 
const image_helper = require('./image_helper.js') 

const canvas = document.getElementById('canvas') 
const ctx = canvas.getContext('2d') 

// Creating img objects 
let img_helper = new image_helper() 
img_helper.load(['lorry', 'cat', 'cab', 'car-1', 'congrats'], ctx) 

// Vehicles objects 
let lorry = new Vehicle({type:2, row_no: 4,dx: 5, img: img_helper.get_img('lorry')}) 
let cab = new Vehicle({dx:3, row_no: 3, img: img_helper.get_img('cab')}) 
let f_car = new Vehicle({type: 1, dx: 5, img: img_helper.get_img('car-1')}) 
let s_car = new Vehicle({type: 1, row_no: 2, img: img_helper.get_img('car-1')}) 
let vehicles = {1: f_car, 2: s_car, 3: cab, 4: lorry} 

// Player object
let player = new Player(img_helper.get_img('cat')) 

let stop = false

let animate = () => {
	if (!stop) {
		window.requestAnimationFrame(animate) 
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight) 	
		// Draw vehicles & player
		draw_vehicle_image(lorry) 
		draw_vehicle_image(cab) 
		draw_vehicle_image(f_car) 
		draw_vehicle_image(s_car) 
		ctx.drawImage(player.img, player.x, player.y) 

		detect_collision()
	}
} 

let draw_vehicle_image = (vehicle) => {
	let vehicle_x = vehicle.update_x()
	
	if (vehicle_x > 720)
		vehicle_x = vehicle.reset_x()
	
	let vehicle_type_factor

	if(vehicle.type == 0)
		vehicle_type_factor = 45
	else if (vehicle.type == 1)
		vehicle_type_factor = 40
	else 
		vehicle_type_factor = 30

	let vehicle_y = (4 - vehicle.row_no) * 100 + vehicle_type_factor
	ctx.drawImage(vehicle.img, vehicle_x, vehicle_y, vehicle.w, vehicle.h) 
}

let detect_collision = () => {
	if (player.row_no == 0)
		return

	if (player.row_no == 5)
		won_game()

	let target_vehicle = vehicles[player.row_no]

	if (target_vehicle) {
		let required_x = target_vehicle.x + target_vehicle.w - (2 * target_vehicle.dx)

		if (required_x == player.x || ((target_vehicle.x + target_vehicle.w) > player.x && target_vehicle.x <= player.x)) 
			player.reset_row()
	}
}

let won_game = () => {
	stop = true
	ctx.drawImage(img_helper.get_img('congrats'), 125, 110)
}

document.addEventListener('DOMContentLoaded', function() { 

	document.addEventListener('keyup', function(e) {
	    const allowedKeys = {
	        37: 'left',
	        38: 'up',
	        39: 'right',
	        40: 'down',
	        82: 'restart'
	    } 

	    if (player.y > 400 && allowedKeys[e.keyCode] == 'down'
	    	|| player.x < 20 && allowedKeys[e.keyCode] == 'left'
	    	|| player.y < 20 && allowedKeys[e.keyCode] == 'up'
	    	|| player.x > 650 && allowedKeys[e.keyCode] == 'right'
	    	|| !stop && allowedKeys[e.keyCode] == 'restart') 
	    	return

	    switch (allowedKeys[e.keyCode]) {
	    	case 'left':
	    		player.decrement({x: 1}) 
	    		break 
	    	case 'right':
	    		player.increment({x:1}) 
	    		break 
	    	case 'up':
	    		player.decrement({y:1}) 
	    		break 
	    	case 'down':
	    		player.increment({y:1}) 
	    		break 
	    	case 'restart':
	    		player.reset_pos()
	    		stop = false
	    		animate()
	    		break
	    }
	}) 
}) 

animate() 
