var express = require('express');
var bodyParser = require('body-parser');
var db = require('./models/index.js');
var models = require("./models");
var Hashids = require("hashids"),
	hashids = new Hashids("Link_Shorty", 7);
var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/static'));

//var id = hashids.encode(12345);

app.get("/", function (request, response){
	response.render("index");
});

app.get('/new/:id', function (request, response) {
	var id = parseInt(request.params.id);
	db.user.find({where: {id: id}}).then(function (users) {
		response.render('new', {users: users});
	});
});


app.post('/', function (request, response){
	var newUrl = request.body.url;
	var newUser = {
		url: newUrl
	};
	db.user.create(newUser).then(function (link){
		link.hash = hashids.encode(link.id);
		link.save().then(function (newLink){
			response.redirect('/new/' + newLink.id);
		});
	});
});

app.get('/count', function (request, response) {
	db.user.findAll({order: '"count" desc'}).then(function (count){
		response.render('count', {count: count});
	})
})



app.listen(3000);