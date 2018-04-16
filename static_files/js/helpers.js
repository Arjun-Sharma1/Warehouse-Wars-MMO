/* Store details when logged in */
var localUser=getCookie("username");
var localScores=getCookie("score");

//Open navigation bar
function openNav() {
	$("#mySidenav").css("width", "250px");
	// When the user clicks anywhere outside of the nav, close it
	$('html').click(function() {
		$("#mySidenav").css("width", "0px");
	});

	$('#test').click(function(event){
		event.stopPropagation();
	});
}

//Update user highscore in database
function updateHighscore(){
	/* Make request to API to update score */    
	var playerData = {"user":localUser, "score":score.time};
	
	var json = JSON.stringify(playerData);                                               
	$.ajax({
		type: "POST",
		contentType: 'application/json',
		url: 'http://cslinux.utm.utoronto.ca:10770/stage.html/updateScore',
		datatype: "json",
		data: json,
		success: function(data){
						 console.log("successfully updated score");
				 },
		error: function(data){
						console.log("Error updating score");
				}
	});
}

//Check user password credentials
function authenticateUser(){
	if(checkInputLogin()){
		user=document.getElementById('username').value;
		pass=document.getElementById('password').value;
		var json = JSON.stringify({"username":user, "password":pass});	
		$.ajax({
			type: "Post",
			contentType: 'application/json',
			url: 'http://cslinux.utm.utoronto.ca:10770/login.html/submit',
			datatype: "json",
			data: json,
			success: function(data){
							document.cookie = "username="+data.username+'# score='+data.score +'; path=/';
							window.location.href='/worlds.html';
					 },
			error: function(data){
							$("#errorMessage1").show();
					}
		});
	}
}

//Used to register user
function registerUser(){
	if (checkInputRegister){
		user=document.getElementById('regUser').value;
		pass=document.getElementById('regPass').value;
		var json = JSON.stringify({"username":user, "password":pass});	
		$.ajax({
			type: "Post",
			contentType: 'application/json',
			url: 'http://cslinux.utm.utoronto.ca:10770/register.html/submit',
			datatype: "json",
			data: json,
			success: function(data){
							window.location.href='/login.html';
					 },
			error: function(data){
							$("#errorMessage2").show();
					}
		});
	}
}

//Used to register user
function changeUserPass(){
	if(checkAccountSettings()){
		user=document.getElementById('user').value;
		pass=document.getElementById('pass').value;
		var json = JSON.stringify({"username":user, "password":pass});	
		$.ajax({
			type: "Post",
			contentType: 'application/json',
			url: 'http://cslinux.utm.utoronto.ca:10770/account.html/submit',
			datatype: "json",
			data: json,
			success: function(data){
							console.log("pass change success");
							window.location.href='/account.html';
					 },
			error: function(data){
							$("#errorMessage2").show();
					}
		});
	}
}
 
 //Used to display dead alert
 function alertAnimate() {
	// Get the modal
	var modal = document.getElementById('deadAlert');

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	$('#deadBody p').text('Oh no! You died! You had a score of '+score.time);
	// When the user clicks on the button, open the modal 
	modal.style.display = "block";

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
	score.reset();
	document.getElementById("btnPlayAgain").disabled = false;
	controlsEnabled = false;
};

//Called when user wants to play again
function playAgain(){
	gameOver = false;
	if (window.DeviceOrientationEvent) {
		window.addEventListener('deviceorientation', function(data){
		 var tiltLR = data.gamma;
		 var tiltFB = data.beta;
		 orientHandle(tiltLR, tiltFB);
		}, false);
	}
	document.getElementById("btnPlayAgain").disabled = true;
	socket.send(JSON.stringify({id:localPlayerId}));
	controlsEnabled = true;
	score.count();
}

//Poplate highscores for front end login page
function populateHighscores(){
	var tableRef = document.getElementById('highscores');
	var url = 'http://cslinux.utm.utoronto.ca:10770/login.html/highscores';	
	var toAdd = "";
	console.log("aaa");
    $.getJSON( url, function( data ) {
		for(var i = 0; i < 10; i++){
			// Insert a row in the table at the last row
			var newRow = tableRef.insertRow(tableRef.rows.length);
		
			// Insert a cell in the row
			var newCell  = newRow.insertCell(0);
			var newCell2  = newRow.insertCell(1);

			// Append a text node to the cell
			var newText  = document.createTextNode(data[i].username);
			var newText2  = document.createTextNode(data[i].highscore);
			newCell.appendChild(newText);
			newCell2.appendChild(newText2);
		}
	});
}

// Check for correct input in login form 
function checkInputLogin(){
	if (!$.trim($("#username").val()) || $.trim($("#username").val()).length<=2){ 
		document.getElementById('username').focus();
		document.getElementById('username').select();
		alert("Username must have 3 or more valid characters.");
    	document.getElementById("username").placeholder = "Please enter valid user";
		return false;
	}else if(!$.trim($("#password").val()) || $.trim($("#password").val()).length<=2){
		document.getElementById('password').focus();
		document.getElementById('password').select();
		alert("Password must have 3 or more valid characters.");
		document.getElementById("password").placeholder = "Please enter valid password";
		return false;
	}else{
		return true;
	}
}


//Break cookie down into array which is readable
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split('#');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Check for correct input in register form 
function checkInputRegister(){
	if (!$.trim($("#regUser").val()) || $.trim($("#regUser").val()).length<=2){   
		document.getElementById('regUser').focus();
		document.getElementById('regUser').select();
		alert("Username must have 3 or more valid characters.");
    	document.getElementById("regUser").placeholder = "Please enter valid user";
		return false;
	}else if(!$.trim($("#regPass").val()) || $.trim($("#regPass").val()).length<=2){
		document.getElementById('regPass').focus();
		document.getElementById("regPass").select();
		alert("Password must have 3 or more valid characters.");
		document.getElementById("regPass").placeholder = "Please enter valid password";
		return false;
	}else{
		return true;
	}
}

// Check for correct input in register form 
function checkAccountSettings(){
	if(!$.trim($("#pass").val()) || $.trim($("#pass").val()).length<=2){
		document.getElementById('pass').focus();
		document.getElementById("pass").select();
		alert("Password must have 3 or more valid characters.");
		document.getElementById("pass").placeholder = "Please enter valid password";
		return false;
	}else{
		return true;
	}
}