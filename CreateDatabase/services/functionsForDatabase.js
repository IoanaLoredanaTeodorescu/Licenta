var fs = require('fs');

var id = null;

var mysql = require('mysql');
var translateText = require('./translate-text.js');

const Translate = require('@google-cloud/translate');

// Your Google Cloud Platform project ID
const projectId = 'licentajusttest';

// Instantiates a client
const translateClient = Translate({
  projectId: projectId
});

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
		let website = restaurant.website || '';

		let existingText = fs.readFileSync('./scripts/insert_datas_into_restaurant.sql').toString();

		if(existingText.indexOf(id) < 0) {
			var stringForInsert = 'INSERT INTO restaurants(id, name, address, lat, lng, tags, phone, opening_hours, reference, rating, website) VALUES(\"'+id+'\",\"'+name+'\",\"'+address+'\",\"'+lat+'\",\"'+lng+'\",\"';
			stringForInsert += tags.slice(0,-2) + '\",\"' + phone + '\",\"' + opening_hours + '\",\"' + reference + '\",\"' + rating + '\",\"' + website +'\");\n';
			fs.appendFileSync('./scripts/insert_datas_into_restaurant.sql', stringForInsert);

			for(var j = 0; j < reviews.length; j++) {
				let author_name = reviews[j].author_name;
				let profile_photo_url = reviews[j].profile_photo_url;
				let rating = reviews[j].rating;
				let time = reviews[j].time;
				let message = reviews[j].text;

				message = message.replace(/"/g, '\\"');

				//aici vreau sa transform mesajul
				// let test = translateText.translateTextInEn(message, 'en');
				// console.log("test translate", test);

				let test = translateClient.translate(message, 'en')
		         .then ((results) => {

		            //translation = results[0];
		            // console.log(`Text: ${text}`);
		            // console.log(`Translation: ${translation}`);
		            return results[1].data.translations[0].translatedText;
		            //return translation;

		            // var message = results[1].data.translations[0].translatedText;
		            // return message;
		          })
				  .then((result) => {
                        message = result;
                        message = message.replace(/"/g, '\\"');

          				let author_email = '';

          				var stringForInsertReviews = 'INSERT INTO reviews VALUES(\"' + id + '\",\"' + author_name + '\",\"' + author_email + '\",\"' + profile_photo_url + '\",\"' + rating + '\",\"' + time + '\",\"' + message + '\");\n';
          				fs.appendFileSync('./scripts/insert_datas_into_reviews.sql', stringForInsertReviews);
				  })
		          .catch((err) => {
		            console.error('ERROR:', err);
		          });

				//   console.log(test)


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
