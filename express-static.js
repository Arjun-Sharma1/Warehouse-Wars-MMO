var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var mongojs = require('mongojs');

var db = mongojs('sharm389:73997@mcsdb.utm.utoronto.ca/sharm389_309', ['sharm389_309']);

// static_files has all of statically returned content
app.use('/',express.static('static_files')); // this directory has files to be returned
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//redirect to login view
app.get('/', function (req, res) {
	res.redirect('login.html');
})

//Login view
app.get('/login.html/highscores', function (req, res) {
	db.sharm389_309.find({},function (err, docs) {
		data=[];
		for(i=0;i<docs.length;i++){
			if(docs[i].users != null) data.push(docs[i].users);
		}
		res.send(data);
	}) 
})

//Retrieve Player info and authenticate them if correct user and pass
app.post('/login.html/submit', function (req, res) {
	//Post requests send parameters in body
	var username = req.body.username;
	var password = req.body.password;
	db.sharm389_309.find({"users.username":username, "users.password":password},function (err, docs) {
		if(docs.length !=1){
			res.status(404).send("Oh uh, something went wrong");
		}else{
			res.send({"username":username, "score":docs[0].users.scores});
		}
	})
})

//Create Player info if they don't already exist in database
app.post('/register.html/submit', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	db.sharm389_309.find({"users.username":username},function (err, docs) {
		if(docs.length ==0){
			db.sharm389_309.insert({"users":{"username":username,"password":password,"scores":[0],"highscore":0}});
			res.send("success");
		}else{
			res.status(404).send("Oh uh, something went wrong");
		}
	})
})

//Update existing player score
app.post('/stage.html/updateScore', function (req, res) {
	var user= req.body.user;
	var score = req.body.score;
	//Check if score is integer
	if(score === parseInt(score, 10)){
		db.sharm389_309.update({"users.username":user}, {$addToSet: {"users.scores":score}});
		db.sharm389_309.find({"users.username":user},function (err, docs) {
			if(docs[0].users.highscore< score){
				db.sharm389_309.update({"users.username":user}, {$set: {"users.highscore":score}});
			}
		})
		res.send("success");
	}else{
		res.status(404).send("Oh uh, something went wrong");
	}
})

//Update player password for account management
app.post('/account.html/submit', function (req, res) {
	var user= req.body.username;
	var pass = req.body.password;
	db.sharm389_309.find({"users.username":user},function (err, docs) {
		if(docs.length !=0){
			db.sharm389_309.update({"users.username":user}, {$set: {"users.password":pass}});
			res.send("success");
		}else{
			res.status(404).send("Oh uh, something went wrong");
		}
	})
	
})

app.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user')
})


app.listen(10770, function () {
  console.log('Example app listening on port 10770!');
});
