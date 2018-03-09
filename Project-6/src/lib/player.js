/**
 * This is player
 */
class Player {
	/**
	* @constructor
   	* @param {object} img - player img
   	*/
	constructor(img) {
	    this.row_no = 0
	    this.img = img
	    this.x = 0
	    this.y = 440
	    this.dx = 50
	    this.dy = 85
	}

	/**
	* @increment
   	* @param {int} x 
   	* @param {int} y 
   	*/
	increment({x=0, y=0}) {
		if(x)
			this.x += this.dx
		
		if(y) {
			this.y += this.dy
			this.row_no--
		}
	}

	/**
	* @decrement
   	* @param {int} x 
   	* @param {int} y 
   	*/
	decrement({x=0, y=0}) {
		if(x)
			this.x -= this.dx
		if(y) {
			this.y -= this.dy
			// this.y < 200 ? this.y -= this.y : this.y -= this.dy
			this.row_no++
		}
	}

	/**
	* @reset_row - get back to row 0
   	*/
   	reset_row() {
   		this.y = 440
   		this.row_no = 0
   	}

	/**
	* @reset_pos - reset to original position 
   	*/
	reset_pos() {
		this.y = 440
		this.x = 0
		this.row_no = 0	
	}

}

module.exports = Player;
