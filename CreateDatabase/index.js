var express = require('express');
var request = require('request');
var fs = require('fs');

var functionsForDatabase = require('./services/functionsForDatabase.js');
var initDatabase = require('./services/initDatabase.js');



var app = express();

var restaurants = [];

request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=47.1742073,27.5707641&radius=500&type=restaurant&key=AIzaSyDRWyS08cDDl1u68x0Sb6pc5esEKaFm60A', (error, response) => {
	if (!error && response.statusCode === 200) {
    	restaurants = restaurants.concat(functionsForDatabase.getRestaurantsReference(response.body));
		fs.writeFileSync('./scripts/insert_datas_into_restaurant.sql', '');
		fs.writeFileSync('./scripts/insert_datas_into_reviews.sql', '');
		fs.writeFileSync('./scripts/insert_datas_into_photos.sql', '');
		if(restaurants.length > 0) {
			for(var i = 0; i < restaurants.length; i++) {
				let link = 'https://maps.googleapis.com/maps/api/place/details/json?reference=' + restaurants[i].reference + '&sensor=true&key=AIzaSyDRWyS08cDDl1u68x0Sb6pc5esEKaFm60A';
				request(link, (error, response) => {
					if (!error && response.statusCode === 200) {
				    	functionsForDatabase.parseResponse(response.body);
				  	}
				  	else {
				 		console.log("Error at API request! ");
				 		process.exit();
					}
				});
			}
		}
  	}
  	else {
 		console.log("Error at API request! ");
 		process.exit();
	}
});



setTimeout(() => {initDatabase.initDatabase()}, 3000);
// setTimeout(() => {initDatabase.insertDataIntoReviews()}, 3000);
// initDatabase.getMessages();
// initDatabase.updateDatabase();

module.exports = app;
