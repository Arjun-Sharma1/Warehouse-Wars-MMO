var Wall = function Wall(x, y){
	// this's location on the stage
	this.x=x;
	this.y=y;
}

// Nothing happens during step
Wall.prototype.step=function(){ return; }

//No other actors can move this around
Wall.prototype.move=function(other, dx, dy){
	return false;
}
module.exports = Wall;
