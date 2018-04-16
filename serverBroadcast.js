var stage = require('./stageModel/ww.php');
var Monster = require('./stageModel/monster.php');
var Player = require('./stageModel/player.php');
var Box = require('./stageModel/box.php');

global.stageInstance = new stage(20,20);
stageInstance.initialize();

var WebSocketServer = require('ws').Server
   ,wss = new WebSocketServer({port: 10771});
 
var users=[];
var actorInfo=[];

wss.on('close', function() {
    console.log('disconnected');
});


//Sends a message to every client connect to server
wss.broadcast = function(message){
	this.clients.forEach(function (ws){ ws.send(message); });
}

wss.on('connection', function(ws) {
	//Occurs everytime a user connects to server
	//Render all actors and sends info to connect client
	wss.actorStringify(true,true,true);
	ws.send(JSON.stringify(actorsInfo));

	//Occurs everytime a message is recieved by server
	ws.on('message', function(message) {
		message=JSON.parse(message);
		found= false;
		for(i=0; i<stageInstance.actors.length; i++){
			if(stageInstance.actors[i] instanceof Player && message.id == stageInstance.actors[i].id){
				stageInstance.actors[i].move(stageInstance.actors[i], message.x,message.y);
				found=true;
			}
		}
		if(!found){
			while(true){
				x = Math.floor(Math.random() * 17) + 1;
				y = Math.floor(Math.random() * 17) + 1;
				if(stageInstance.getActor(x,y) ==null){
					player = new Player(x,y,message.id);
					stageInstance.addActor(player);
					break;
				}
			}
		}
		wss.actorStringify(true,true,false);
		wss.broadcast(JSON.stringify(actorsInfo));
	});
});

//Turn each player into a format that can be read by the client
wss.actorStringify= function(bflag,pflag,mflag){
	actorsInfo = [];
	actorsToRemove=[];
	for(i=0; i<stageInstance.actors.length; i++){ 
		actor=stageInstance.actors[i];
		if(actor.dead == true){
			actorsToRemove.push(actor);
		}
		if(actor instanceof Box && bflag){
			actorsInfo.push({'type':'Box', 'x': actor.x, 'y': actor.y, 'id':actor.id})
		}
		else if(actor instanceof Player && pflag) 
			actorsInfo.push({'type':'Player', 'x': actor.x, 'y': actor.y, 'id':actor.id,'dead':actor.dead})
		else if(actor instanceof Monster && mflag) 
			actorsInfo.push({'type':'Monster', 'x': actor.x, 'y': actor.y, 'id':actor.id,'dead':actor.dead})
	};
	for(i=0; i<actorsToRemove.length; i++){ 
		stageInstance.removeActor(actorsToRemove[i]);
	}
}

//Creates a world when server is started
wss.startWorld=function(){
	interval = setInterval(function(){ 
		if(stageInstance.over) {
			clearInterval(interval);
		}else{
			actorsInfo=[];
			stageInstance.step();
			wss.actorStringify(false,false,true);
			wss.broadcast(JSON.stringify(actorsInfo));
		}
	}, 1000);
}
wss.startWorld();



