var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var db = require('./models');
var Hashids = require('hashids'),
	hashids = new Hashids('this is my salt');

var app = express();

app.use(ejsLayouts);
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/static'));

app.set('view engine', 'ejs');

app.get('/', function(req,res){
	res.render('index');
});

app.post('/links', function(req,res){
	db.link.create({
		url: req.body.url,
		// hash: ''
	}).then(function(link){
		// link.hash = hashids.encode(link.id);
		// link.save().then(function(){
			res.redirect('/links/' + link.id);
		});
	});

app.get('/links/:id', function(req,res){
	db.link.findById(req.params.id).then(function(link){
		res.render('links/show', {link: link, hashids: hashids});
	});
});

app.get('/links', function(req,res){
	db.link.findAll({
		order: 'clicks DESC'
	}).then(function(links){
		res.render('links/index', {links: links, hasids: hashids});
	});
});

app.get('/:hash', function(req,res){
	db.link.find({
		where: {
			id: hashids.decode(req.params.hash)
		}
	}).then(function(link) {
		link.clicks++;
		link.save().then(function(link){
			res.redirect(link.url);
		});
	});
});

app.listen(3000, function(){
	console.log('Port 3000 is live');
});
