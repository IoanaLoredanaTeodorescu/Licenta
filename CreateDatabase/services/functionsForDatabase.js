var fs = require('fs');
var id = null;

var mysql = require('mysql');

var reviews = [];

var searchIfExists = (stringToSearch, stringWhereToSearch) => {
	return stringWhereToSearch.indexOf(stringToSearch);
}

function connectionEnd(conn, id) {
	conn.end((err) => {
		if(err) {
			console.log('Error disconnecting from database! \nExecution stopped! \n' + 'Error message: ' + err.message);
			res.json({typeError: 'DBdisconnect', text: 'Error disconnecting from database! \nExecution stopped! \n' + 'Error message: ' + err.message});
		}
		console.log('Connection with id: ' + id + ' disconected!');
	});
}
module.exports = {
	getRestaurantsReference: (res) => {
		let obj = JSON.parse(res);
		let restaurants = obj.results;
		let array = [];
		for(var i = 0; i < restaurants.length; i++){
		 	let restaurant = restaurants[i];
		 	let id = restaurant.id;
		 	let name = restaurant.name;
			let reference = restaurant.reference;
			array = array.concat({id: id, name: name, reference: reference});
		}
		return array;
	},

	parseResponse: (res) => {
		let obj = JSON.parse(res);
		let restaurant = obj.result;

		let address = restaurant.formatted_address || '';
		let phone = restaurant.international_phone_number || restaurant.formatted_phone_number || '';
		let id = restaurant.id || '';
		let lat = restaurant.geometry.location.lat || '';
		let lng = restaurant.geometry.location.lng || '';
		let name = restaurant.name || '';
		let opening_hours = restaurant.opening_hours ? restaurant.opening_hours.weekday_text : '';
		let photos = restaurant.photos || '';
		reviews = reviews.concat({id: id, reviews: restaurant.reviews || ''});
		let tags = restaurant.types || '';
		let reference = restaurant.reference || '';

		var photo_arr = [];

		for(var j = 0; j < photos.length; j++) {
			photo_arr.concat(photos[j].photo_reference);
		}

		var photos_string = photo_arr.toString();

		//console.log(address);
		// console.log(phone);
		// console.log(id);
		// console.log(lat);
		// console.log(lng);
		// console.log(name);
		// console.log(opening_hours);
		// console.log(photos);
		// console.log(reviews);
		// console.log(tags);
		// console.log(reference);

		let existingText = fs.readFileSync('./scripts/insert_datas_into_restaurant.sql').toString();


		if(existingText.indexOf(id) < 0) {
			var stringForInsert = 'INSERT INTO restaurants(id, name, address, lat, lng, tags, phone, opening_hours, reference) VALUES(\"'+id+'\",\"'+name+'\",\"'+address+'\",\"'+lat+'\",\"'+lng+'\",\"';

			//stringForInsert += tags.slice(0,-2) + '\",\"' + phone + '\",\"' + opening_hours + '\",\"' + reference + '\",\"' + photos_string + '\");\n';
			stringForInsert += tags.slice(0,-2) + '\",\"' + phone + '\",\"' + opening_hours + '\",\"' + reference + '\");\n';

			fs.appendFileSync('./scripts/insert_datas_into_restaurant.sql', stringForInsert);
		}

	},

	createTableReviewForEachRestaurant: () => {

		var connection = mysql.createConnection({
										  	host: "localhost",
										 	user: "root",
										 	password: "",
										  	database: "restaurants",
										  	debug: false,
    										multipleStatements: true
										});
		connection.connect((err) => {
			if(err) {
				console.log('Error connecting to database! \nExecution stopped! \n' + 'Error message: ' + err.message);
				process.exit();
			}
			id = connection.threadId;
			console.log('Connection established!\nConnected with id: ' + id);
		});

		connection.query('SELECT id FROM restaurants', (err, result) => {
			var results = null;
		    if(err) {
				console.log('Error searching in database! \nExecution stopped! \n' + 'Error message: ' + err.message);
				res.json({typeError: 'DBselect', text: 'Error searching in database! \nExecution stopped! \n' + 'Error message: ' + err.message});
				connectionEnd(connection, id);
		    } else {
				fs.writeFileSync('./scripts/create_restaurants_tables_reviews.sql', '');
				for(var j = 0; j < result.length; j++){
					var name = result[j].id;
					var script = 'CREATE OR REPLACE TABLE idrestaurant_' + name + ' (user VARCHAR(50), review VARCHAR(500), relative_time_description VARCHAR(50), profile_photo_url VARCHAR(200), rating VARCHAR(4));\n';
					fs.appendFileSync('./scripts/create_restaurants_tables_reviews.sql', script);
				}
				connectionEnd(connection, id);
		    }
		});
	},

	insertDataInEachTableReview: () => {

		var connection = mysql.createConnection({
										  	host: "localhost",
										 	user: "root",
										 	password: "",
										  	database: "restaurants",
										  	debug: false,
    										multipleStatements: true
										});
		connection.connect((err) => {
			if(err) {
				console.log('Error connecting to database! \nExecution stopped! \n' + 'Error message: ' + err.message);
				process.exit();
			}
			id = connection.threadId;
			console.log('Connection established!\nConnected with id: ' + id);
		});

		connection.query('SELECT id FROM restaurants', (err, result) => {
			var results = null;
		    if(err) {
				console.log('Error searching in database! \nExecution stopped! \n' + 'Error message: ' + err.message);
				res.json({typeError: 'DBselect', text: 'Error searching in database! \nExecution stopped! \n' + 'Error message: ' + err.message});
				connectionEnd(connection, id);
		    } else {
				fs.writeFileSync('./scripts/create_restaurants_tables.sql', '');
				for(var j = 0; j < result.length; j++){
					var name = result[j].id;
					var script = 'CREATE OR REPLACE TABLE idrestaurant_' + name + ' (user VARCHAR(50), review VARCHAR(500), relative_time_description VARCHAR(50), profile_photo_url VARCHAR(200), rating VARCHAR(4));\n';
					fs.appendFileSync('./scripts/create_restaurants_tables.sql', script);
				}
				connectionEnd(connection, id);
		    }
		});
	}
}




var replaceDiacritics = (stringWhereToSearch) => {
		if(stringWhereToSearch.indexOf('Ș') > -1) {
			stringWhereToSearch.replace('Ș','kkkk');
		}
		console.log(stringWhereToSearch);
	return stringWhereToSearch;
}
