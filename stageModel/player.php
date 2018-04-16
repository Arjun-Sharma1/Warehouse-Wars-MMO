var Monster = require('./monster.php');

var Player=function Player(x, y, id){
	// this's location on the stage
	this.x=x;
	this.y=y;
	this.id=id;
	this.dead=false;
}

// What to do during a step
Player.prototype.step=function(){ return; }

// If Player or another Box is in the way, we recursively go in that direction
// return true if player dead or false ow
Player.prototype.move=function(other, dx, dy){
	// Where we are supposed to move. 
	var newx=this.x+dx;
	var newy=this.y+dy;

	// Determine if another Actor is occupying (newx, newy). 
	// If so, check if we can move; if that actor moved we move to (newx, newy)
	// return true if we moved, otherwise false
	
	if (other instanceof Monster) { // Monster here, player is dead
		this.dead=true;
		return true;
	} else {
		adjacent = stageInstance.getActor(newx,newy);
		if(adjacent instanceof Monster){ // Monster here, player is dead
			this.dead=true;
			return true;
		}
		else if(adjacent == null || adjacent.move(this , dx, dy)){ // Move player and other actors in path
			stageInstance.removeActor(this);
			this.x = newx;
			this.y = newy;
			stageInstance.addActor(this);
			return false; //Successful move
		} else {
			return false; // Didn't move, return false
		}
	}
}
module.exports = Player;