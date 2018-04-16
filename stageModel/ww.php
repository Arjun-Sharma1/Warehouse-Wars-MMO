// Stage
var Player = require("./player.php");
var Wall = require("./wall.php");
var Box = require('./box.php');
var Monster = require('./monster.php');


var Stage=function Stage(width, height){
	this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
	this.player=null; // a special actor, the player
	this.pause = false; // Holds whether the game is paused or not
	this.over = false; //Holds whether game is over

	// the logical width and height of the stage
	this.width=width;
	this.height=height;
}
// initialize an instance of the game
Stage.prototype.initialize=function(){

	// Add walls around the outside of the stage, so actors can't leave the stage
	for(var y=0; y<this.height; y++) {
		for(var x=0; x < this.width; x++){
			if(y==0 || x==0 || y==this.height-1 || x==this.width-1){
				wall = new Wall(x, y);
				this.addActor(wall);
			}
		}
	}

	// Add some Boxes to the stage
	var i = 0;
	while (i < Math.round( (this.height*this.width)*0.20) ) {
		randx = Math.floor(Math.random() * (x-2)) + 1;
		randy = Math.floor(Math.random() * (y-2)) + 1;
		if (this.getActor(randx,randy)==null){
			boxId=Math.round((Math.random() * 1000000));
			box = new Box(randx, randy,boxId);
			this.addActor(box);
			i++;
		}
	}

	// Add in some Monsters
	var i = 0;
	var maxmon =  Math.round((this.height*this.width)*0.1);
	while (i < 5) {
		randx = Math.floor(Math.random() * (x-2)) + 1;
		randy = Math.floor(Math.random() * (y-2)) + 1;
		if (this.getActor(randx,randy)==null){
			monsterId=Math.round((Math.random() * 1000000));
			monster = new Monster(randx, randy,monsterId);
			this.addActor(monster);
			i++;
		}
	}
}


Stage.prototype.addActor=function(actor){
	this.actors.push(actor);
}

Stage.prototype.removeActor=function(actor){
	// Lookup javascript array manipulation (indexOf and splice).
	var holder = this.actors.indexOf(actor);
	this.actors.splice(holder, 1);
}

// return the first actor at coordinates (x,y) return null if there is no such actor
// there should be only one actor at (x,y)!
Stage.prototype.getActor=function(x, y){
	var found = null;
	for(i = 0; i < this.actors.length; i++ ){
		if(this.actors[i].x == x && this.actors[i].y == y){
			found = this.actors[i];
		}
	}
	return found;
}

// Take one step in the animation of the game.  
Stage.prototype.step=function(){
	if (this.getNumMonster()==0){ 
		// Check if there is no monsters in the actors array, then game is won
		this.over = true;  
	} else if(!this.over && ! this.pause){
		// If the game is not paused, call all actors' step
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].step();
		}
	} 
}

// get the number monsters in the actors array
Stage.prototype.getNumMonster=function(){
	var numMon = 0
	for (var i=0; i < this.actors.length; i++){
		if (this.actors[i] instanceof Monster){
			numMon++;
		}
	}
	return numMon;
}

// Return a random number between the range of a min and max
Stage.prototype.getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Return a random number between the range of a min and max
Stage.prototype.moveActor = function(actor,x,y) {
  actors.move(this.actors[i], message.x,message.y);
}

module.exports = Stage;

// End Class Stage