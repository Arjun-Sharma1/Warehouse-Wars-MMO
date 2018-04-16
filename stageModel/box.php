var Monster = require('./monster.php');
var Player = require('./player.php');

var Box = function Box(x, y,id){
	// Instantiate the location of Box 
	this.x=x;
	this.y=y;
	this.id=id;
}

// Each time step is called do nothing
Box.prototype.step=function(){ return; }

// If Player or another Box is in the way, we recursively go in that direction
// return true if we moved, false otherwise.
Box.prototype.move=function(other, dx, dy){
	// Where we are supposed to move. 
	var newx=this.x+dx;
	var newy=this.y+dy;

	// Determine if another Actor is occupying (newx, newy). 
	// If so, check if we can move; if that actor moved we move to (newx, newy)
	// return true if we moved, otherwise false

	adjacent = stageInstance.getActor(newx,newy);
	if((adjacent == null || adjacent.move(this, dx, dy)) ){	
		stageInstance.removeActor(this);
		this.x = newx;
		this.y = newy;
		stageInstance.addActor(this);
		return true; // Moved, return true
	} else {
		return false; // Didn't move, return false
	}
}
module.exports = Box;