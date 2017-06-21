var fs = require('fs');
var id = null;

var mysql = require('mysql');

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
		let reviews = restaurant.reviews || '';
		let tags = restaurant.types || '';
		let reference = restaurant.reference || '';
		let rating = restaurant.rating || '';

		let existingText = fs.readFileSync('./scripts/insert_datas_into_restaurant.sql').toString();

		if(existingText.indexOf(id) < 0) {
			var stringForInsert = 'INSERT INTO restaurants(id, name, address, lat, lng, tags, phone, opening_hours, reference, rating) VALUES(\"'+id+'\",\"'+name+'\",\"'+address+'\",\"'+lat+'\",\"'+lng+'\",\"';
			stringForInsert += tags.slice(0,-2) + '\",\"' + phone + '\",\"' + opening_hours + '\",\"' + reference + '\",\"' + rating + '\");\n';
			fs.appendFileSync('./scripts/insert_datas_into_restaurant.sql', stringForInsert);

			for(var j = 0; j < reviews.length; j++) {
				let author_name = reviews[j].author_name;
				let profile_photo_url = reviews[j].profile_photo_url;
				let rating = reviews[j].rating;
				let relative_time_description = reviews[j].relative_time_description;
				let message = reviews[j].text;
				message = message.replace(/"/g, '\\"');

				var stringForInsertReviews = 'INSERT INTO reviews VALUES(\"' + id + '\",\"' + author_name + '\",\"' + profile_photo_url + '\",\"' + rating + '\",\"' + relative_time_description + '\",\"' + message + '\");\n';
				fs.appendFileSync('./scripts/insert_datas_into_reviews.sql', stringForInsertReviews);
			}

			for(var j = 0; j < photos.length; j++) {
				var html_attributions = photos[j].html_attributions.toString().split(">")[0].split("=")[1];
				var photo_reference = photos[j].photo_reference;

				var stringForInsertPhotos = 'INSERT INTO photos VALUES(\"' + id + '\",' + html_attributions + ',\"' + photo_reference + '\");\n';
				fs.appendFileSync('./scripts/insert_datas_into_photos.sql', stringForInsertPhotos);
			}
		}

	}
}
