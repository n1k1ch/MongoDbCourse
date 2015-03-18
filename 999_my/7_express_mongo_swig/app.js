var express = require('express'),
	consolidate = require('consolidate'),
	MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server;

var app = express();

var mongoclient = new MongoClient(new Server('localhost', 27017));
var db = mongoclient.db('course');


app.engine('html', consolidate.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {

	db.collection('hello_combined').findOne({}, function(err, doc) {
		res.render('hello', doc);
	});
});


mongoclient.open(function(err, mongoclient) {
	if(err) {
		throw err;
	}

	app.listen(1010);
	console.log('Listening on ' + 1010);
});