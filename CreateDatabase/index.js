var express = require('express');
var request = require('request');

var functionsForDatabase = require('./services/functionsForDatabase.js');
var initDatabase = require('./services/initDatabase.js');


var app = express();

request('https://maps.googleapis.com/maps/api/place/textsearch/json?query=bars+in+Iasi&key=AIzaSyAcazHnIcfjOfoG6Z3TkUZ-Cw5J_KvmTLo', (error, response) => {
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
setTimeout(() => {functionsForDatabase.createTableForEachRestaurant()}, 3000);
setTimeout(() => {initDatabase.createTablesForEachRestaurant()}, 3000);



module.exports = app;
