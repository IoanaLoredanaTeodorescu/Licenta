var express = require('express');
var request = require('request');

var functionsForDatabase = require('./services/functionsForDatabase.js');
var initDatabase = require('./services/initDatabase.js');


var app = express();

request('https://maps.googleapis.com/maps/api/place/textsearch/json?query=bars+in+Iasi&key=AIzaSyCg5KfGgwMiausblKsuYNzyZwknFJ6n54c', (error, response) => {
	if (!error && response.statusCode === 200) {
		//console.log(response.body)
    	functionsForDatabase.parseResponse(response.body);
  	}
  	else {
 		console.log("Error at API request! ");
 		process.exit();
	}
});

initDatabase.initDatabase();


module.exports = app;
