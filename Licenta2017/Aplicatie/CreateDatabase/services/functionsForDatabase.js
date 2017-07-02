var fs = require('fs');

var id = null;

var mysql = require('mysql');

const Translate = require('@google-cloud/translate');

// Your Google Cloud Platform project ID
const projectId = 'licentaproject-172212';

// Instantiates a client
const translateClient = Translate({
  projectId: projectId,
  keyFilename: './LicentaProject-42d799eb0455.json'
});

var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

var nlu = new NaturalLanguageUnderstandingV1({
    username: "4359a02e-478e-4120-be80-6f69fbba2199",
    password: "Iif3txh3puVc",
    version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
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
                let credibility_score = 0;
				let author_name = reviews[j].author_name;
				let profile_photo_url = reviews[j].profile_photo_url;
				let rating = reviews[j].rating;
				let time = reviews[j].time;
				let message = reviews[j].text;

				message = message.replace(/"/g, '\\"');

				translateClient.translate(message, 'en')
		         .then ((results) => {
		            return results[1].data.translations[0].translatedText;
		          })
				  .then((result) => {
                        message = result;
                        let author_email = '';
                        message = message.trim();

                        if(message !== ""){
                            nlu.analyze(
                            {
                         		'html': message,
                         		'features': {
                         			'sentiment': {}
                         		}
                         	},
                         	function(err, response) {
                         		if (err)
                         			console.log('Error:', err);
                         		else {
                         			let rate = rating;
                         			score = parseFloat(JSON.parse(JSON.stringify(response, null, 2)).sentiment.document.score);
                         			rate = parseFloat(rate);
                         			let newRate = null;
                         			if(rate < 3) {
                         				newRate = (-1) * rate;
                        			} else newRate = rate;

                        			if(score < 0 && newRate < 0) {
                        				switch (newRate) {
                        					case -1:
                        						newRate = -5;
                        						break;
                        					case -2:
                        						newRate = -4;
                        					default:
                        						newRate = newRate;
                        				}
                        				credibility_score = (-1) * (score + newRate);
                        			} else if(score >= 0 && newRate > 0) {
                        				credibility_score = score + newRate;
                        			} else if(score < 0 && newRate > 0) {
                        				credibility_score = score + (-1) * newRate;
                        			} else if(score >= 0 && newRate < 0) {
                        				switch (newRate) {
                        					case -1:
                        						newRate = -5;
                        						break;
                        					case -2:
                        						newRate = -4;
                        					default:
                        						newRate = newRate;
                        				}

                        				credibility_score = (-1) * score + newRate;
                        			}
                        		}
                                message = message.replace(/"/g, '\\"');
                                var stringForInsertReviews = 'INSERT INTO reviews VALUES(\"' + id + '\",\"' + author_name + '\",\"' + author_email + '\",\"' + profile_photo_url + '\",\"' + rating + '\",\"' + time + '\",\"' + message + '\",\"' + credibility_score + '\");\n';
                                fs.appendFileSync('./scripts/insert_datas_into_reviews.sql', stringForInsertReviews);
                        	})
                        } else {
                            credibility_score = 0;
                            message = message.replace(/"/g, '\\"');
                            var stringForInsertReviews = 'INSERT INTO reviews VALUES(\"' + id + '\",\"' + author_name + '\",\"' + author_email + '\",\"' + profile_photo_url + '\",\"' + rating + '\",\"' + time + '\",\"' + message + '\",\"' + credibility_score + '\");\n';
                            fs.appendFileSync('./scripts/insert_datas_into_reviews.sql', stringForInsertReviews);
                        }


                  })
		          .catch((err) => {
		            console.error('message', message, 'ERROR:', err);
		          });

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
