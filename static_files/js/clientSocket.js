var socket;
var localPlayerId;
var actors=[];
var score= new Clock();
var controlsEnabled=true;
var gameOver=false;


$(function(){
	rendered=false;
	playerImageSrc = document.getElementById('playerImage').src;
	friendImageSrc = document.getElementById('friendImage').src;
	blankImageSrc=document.getElementById('blankImage').src;
	monsterImageSrc=document.getElementById('monsterImage').src;
	playerImageSrc=document.getElementById('playerImage').src;
	boxImageSrc=document.getElementById('boxImage').src;
	wallImageSrc=document.getElementById('wallImage').src;
	socket = new WebSocket("ws://cslinux.utm.utoronto.ca:10771");
	var s='<table>';
	document.getElementById('username_display').innerText = "Username: "+localUser;
	//If person didn't log in, send them to login page
	if(localUser == null) window.location.href='/login.html'
	document.getElementById("btnPlayAgain").disabled = true;
	socket.onopen = function (event) {
		//Send new player on connect
		$('#sendButton').removeAttr('disabled');
		localPlayerId=Math.round((Math.random() * 10000));
		socket.send(JSON.stringify({id:localPlayerId}));
		score.count();
		console.log("connected");
		if (window.DeviceOrientationEvent) {
			window.addEventListener('deviceorientation', function(data){
			 var tiltLR = data.gamma;
			 var tiltFB = data.beta;
			 orientHandle(tiltLR, tiltFB);
			}, false);
		}
		
		// Added this code
		for(var y=0;y<20;y++){
			s+="<tr>";
			for(var x=0;x<20;x++){
				if(y==0 || x==0 || y==19 || x==19){
					s=s + '<td><img src="' + wallImageSrc +'" id="' + "stage_"+x+"_"+y + '" /></td>';
				}else{
					s=s + '<td><img src="' + blankImageSrc +'" id="' + "stage_"+x+"_"+y + '" /></td>';
				}
			}
			s+="</tr>";
		}
		s+="</table>";
		document.getElementById("stage").innerHTML=s; 
		playerKeyboardControls();
	};
	
	socket.onclose = function (event) {
		score.reset();
		socket.send(JSON.stringify({id:"Closed"}));
	};
	
	socket.onmessage = function (event) {
		var stageData=JSON.parse(event.data);
		//Parse and render data retrieved from server
		for(i=0; i<stageData.length; i++){
			x=stageData[i].x;
			y=stageData[i].y;
			id=stageData[i].id;
			actorType= stageData[i].type;
			if(stageData[i].dead ==true){
				document.getElementById("stage_"+actors[id][0]+"_"+actors[id][1]).src=blankImageSrc;
				actors[id] = null;
				if(actorType=='Player' && localPlayerId == id){
					window.removeEventListener("deviceorientation", orientHandle);
					updateHighscore();
					alertAnimate();
				}
			}
			else if(actorType == 'Box'){
				if(actors[id] != null){
					document.getElementById("stage_"+actors[id][0]+"_"+actors[id][1]).src=blankImageSrc;
				}
				actors[id] = [x,y];
				document.getElementById("stage_"+x+"_"+y).src=boxImageSrc;
			}else if(actorType == 'Player'){
				if(actors[id] != null){
					document.getElementById("stage_"+actors[id][0]+"_"+actors[id][1]).src=blankImageSrc;
				}
				if(stageData[i].id == localPlayerId){
					document.getElementById("stage_"+x+"_"+y).src=playerImageSrc;
				}else{
					document.getElementById("stage_"+x+"_"+y).src=friendImageSrc;
				}
				actors[id] = [x,y];
			}else if(actorType == 'Monster'){
				if(actors[id] != null){
					document.getElementById("stage_"+actors[id][0]+"_"+actors[id][1]).src=blankImageSrc;
				}
				actors[id] = [x,y];
				document.getElementById("stage_"+x+"_"+y).src=monsterImageSrc;
			}
		}	
	}
});

//Keyboard controls for players
playerKeyboardControls =function(){
	document.onkeydown = function(event) {
		if(controlsEnabled){
			var key = event.keyCode;
			var move=false;
			var movement={};
			switch (key) {
				case 81: //Q
					move=true;
					movement={x:-1,y:-1};
					break;
				case 87: //W
					move=true;
					movement={x:0,y:-1};
					break;
				case 69: //E
					move=true;
					movement={x:1,y:-1};
					break;
				case 65: //A
					move=true;
					movement={x:-1,y:0};
					break;
				case 68: //D
					move=true;
					movement={x:1,y:0};
					break;
				case 90: //Z
					move=true;
					movement={x:-1,y:1};
					break;
				case 88: //X
					move=true;
					movement={x:0,y:1};
					break;
				case 67: //C
					move=true;
					movement={x:1,y:1};
					break;
			}
			if(move){
				playerInfo={'type':'Player', 'x': movement.x, 'y': movement.y, 'id':localPlayerId};
				socket.send(JSON.stringify(playerInfo));
			}
		}
	};
}

//Tilt for device/phone functionality
orientHandle =function(tiltLR, tiltFB){
    var moveTime = 500;
    var x = 0;
    var y = 0;
    if (tiltLR < -15 && tiltFB > 25){
        movement={x:-1,y:1};
    }else if(tiltLR < -15 && tiltFB < -10){
        movement={x:-1,y:-1};
    }else if(tiltLR > 15 && tiltFB > 25){
        movement={x:1,y:1};
    }else if(tiltLR > 15 && tiltFB < -10){
        movement={x:1,y:-1};
    }else if(tiltLR < -15){
        movement={x:-1,y:0};
    }else if (tiltLR > 15){
        movement={x:1,y:0};
    }else if(tiltFB < -10){
        movement={x:0,y:-1};
    }else if (tiltFB > 25){
        movement={x:0,y:1};
    }
    if((x!=0 || y!=0) && !gameOver){
		playerInfo={'type':'Player', 'x': movement.x, 'y': movement.y, 'id':localPlayerId};
		socket.send(JSON.stringify(playerInfo));
	}
}



	
