var Box = require('./box.php');
var Player = require('./player.php');
var Wall = require('./wall.php');


var Monster = function Monster(x, y,id){
	this.x=x;
	this.y=y;
	this.dx=-1;
	this.dy=-1;
	this.id=id;
	this.dead=false;

	// All possible directions a monster could move
	this.xmoves = [-1, 0, 1, -1, 1, -1, 0, 1];
	this.ymoves = [-1, -1, -1, 0, 0, 1, 1, 1];
	// Note: Regular monsters choose a random index to move.
	// Note: Smart monsters only move to a valid walkable direction
}

// Called during each step
Monster.prototype.step=function(){

	// Check if dead, or if not then just move
	if (this.is_dead()==true){
		this.dead=true;
	} else {
		var moveable = false;
		while (moveable == false){
			var randMove = stageInstance.getRandomInt(0, 7);
			direction = stageInstance.getActor(this.x + this.xmoves[randMove], this.y + this.ymoves[randMove]);
			if (!(direction instanceof Box || direction instanceof Wall || direction instanceof Monster)){
				this.move(this, this.xmoves[randMove], this.ymoves[randMove]);
				moveable = true;
			}
		}		
	}
}

// Move the monster
Monster.prototype.move=function(other, dx, dy){
	if(!(other===this))return false;
	var newx=this.x+dx;
	var newy=this.y+dy;

	adjacent = stageInstance.getActor(newx,newy);
	if(adjacent == null || adjacent.move(this, dx, dy)){	
		stageInstance.removeActor(this);
		this.x = newx;
		this.y = newy;
		stageInstance.addActor(this);
		return true;
	} else {
		return false;
	}
}

// Return whether monster is is dead
Monster.prototype.is_dead=function(){

	//Check all squares around monster
	var numSurroundElement = 0;
	var i = 0;
	while (i<this.xmoves.length){
		direction = stageInstance.getActor(this.x + this.xmoves[i], this.y + this.ymoves[i]);
		if (direction instanceof Box || direction instanceof Wall || direction instanceof Monster){
			numSurroundElement += 1;
		}
		i++;
	}

	// If surrounded by all walls,monsters,boxs then dead 
	if (numSurroundElement==8){
		return true;
	} else {
		return false;
	}
}
module.exports = Monster;