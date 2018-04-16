function Clock(){
    this.time = 0;
    this.execute = false;
    this.interval;
}

Clock.prototype.reset = function(){
    this.execute = false;
    this.time = 0;
	document.getElementById("game_score").innerHTML = "Score: "+this.time;
    clearInterval(this.interval);
}

Clock.prototype.toggle = function(){
    this.execute = !this.execute;
    if(this.execute){
        this.count();
    }else{
        clearInterval(this.interval);
    }
}

Clock.prototype.count = function(){
	self=this;
    this.interval = setInterval(function(){
        self.time += 1;
		document.getElementById("game_score").innerHTML = "Score: "+self.time;
    }, 1000);
}