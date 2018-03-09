/**
 * This is Enemy in the game
 */
class Vehicle {
	/**
	* @constructor
   	* @param {number} type - vehicle type
   	* @param {number} dx - vehicle required speed
   	* @param {number} row_no - vehicle row no
   	* @param {string} img - vehicle img
   	*/
	constructor({type=0, dx=2, row_no=1, img}) {
	    this.type = type
	    this.dx = dx
	    this.row_no = row_no
	    this.img = img
	    switch(this.type) {
	    	case 0:
	    		this.w = 100;
	    		this.h = 100;
	    		break;
			case 1: 
				this.w = 120;
				this.h = 120;
				break;
			case 2:
				this.w = 150;
				this.h = 150;
				break;
		}
		// consider vehicle body width
	    this.x = -(this.w)
	}

	update_x() {
		this.x += this.dx
		return this.x
	}

	reset_x() {
		this.x = -(this.w)	
		return this.x
	}
}

module.exports = Vehicle;
