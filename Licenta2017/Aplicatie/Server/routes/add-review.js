var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var id = null;

const Translate = require('@google-cloud/translate');

// Your Google Cloud Platform project ID
const projectId = 'iulian-172211';

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

router.post('/', (req, res, next) => {

	var email = req.body.email,
		idRestaurant = req.body.idRestaurant,
		textareaValue = req.body.textareaValue,
        rate = req.body.rate,
        name = req.body.name,
        photo = '';
        console.log(email, name)

	let score = null,
		credibility_score = null,
		textareaValue_translated = null;


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
				res.json({typeError: 'DBconnect', text: 'Error connecting to database! \nExecution stopped! \n' + 'Error message: ' + err.message});
			}
			id = connection.threadId;
			console.log('Connection established!\nConnected with id: ' + id);
		});


		translateClient.translate(textareaValue, 'en')
		 .then ((results) => {
			return results[1].data.translations[0].translatedText;
		  })
		  .then((result) => {
				textareaValue_translated = result;
				nlu.analyze(
				{
					'html': textareaValue_translated,
					'features': {
						'sentiment': {}
					}
				},
				function(err, response) {
					if (err)
						console.log('Error:', err);
					else {
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
					textareaValue = textareaValue.replace(/"/g, '\\"');
					connection.query('INSERT INTO reviews VALUES(\"' + idRestaurant + '\",\"' + name + '\",\"' + email + '\",\"' + photo + '\",\"' + rate + '\",\"' + Date.now() + '\",\"' + textareaValue + '\",\"' + credibility_score + '\")', (err, result, fields) => {
						if(err) {
							console.log('Error insering in database! \nExecution stopped! \n' + 'Error message: ' + err.message);
							res.json({typeError: 'DBinserting', text: 'Error inserting to database!', message: 'Eroare la adăugarea recenziei!'});
							connectionEnd(connection, id);
						} else {
							if(result.affectedRows === 1) {
								res.json({typeError: 'NoError', text: 'Inserted in DB!', message: 'Recenzia a fost adăugată!'});
							} else {
								res.json({typeError: 'DBinserting', text: 'Error inserting to database!'});
							}
						}
					});
					connection.query('SELECT * FROM reviews WHERE id=\"' + idRestaurant + '\"', (err, result, fields) => {
						if(err) {
							console.log('Error update database! \nExecution stopped! \n' + 'Error message: ' + err.message);
							connectionEnd(connection, id);
						} else {
							let resNr = result.length;
							let sum = 0;
							for(var i = 0; i < resNr; i++) {
								sum += parseFloat(result[i].rating);
							}
							let av = parseFloat(sum/resNr).toFixed(1);

							connection.query('UPDATE restaurants SET rating=\"' + av + '\" WHERE id=\"' + idRestaurant + '\"', (err, result, fields) => {
								console.log(av)
								if(err) {
									console.log('Error update database! \nExecution stopped! \n' + 'Error message: ' + err.message);
									connectionEnd(connection, id);
								} else {
									if(result.affectedRows === 1) {
										console.log('ok');
										connectionEnd(connection, id);
									} else {
										connectionEnd(connection, id);
									}
								}
							});
						}
					});
				});
		  })
		  .catch((err) => {
			console.error('ERROR:', err);
		  });



});

module.exports = router;
