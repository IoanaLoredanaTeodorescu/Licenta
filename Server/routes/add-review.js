var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var id = null;

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
    console.log('INSERT INTO reviews VALUES(\"' + idRestaurant + '\",\"' + name + '\",\"' + email + '\",\"' + photo + '\",\"' + rate + '\",\"' + Date.now() + '\",\"' + textareaValue + '\")')
	connection.query('INSERT INTO reviews VALUES(\"' + idRestaurant + '\",\"' + name + '\",\"' + email + '\",\"' + photo + '\",\"' + rate + '\",\"' + Date.now() + '\",\"' + textareaValue + '\")', (err, result, fields) => {
		if(err) {
			console.log('Error insering in database! \nExecution stopped! \n' + 'Error message: ' + err.message);
			res.json({typeError: 'DBinserting', text: 'Error inserting to database!', message: 'Eroare la adăugarea recenziei!'});
			connectionEnd(connection, id);
		} else {
			if(result.affectedRows === 1) {
				res.json({typeError: 'NoError', text: 'Inserted in DB!', message: 'Recenzia a fost adăugată!'});
				connection.end();
			} else {
				res.json({typeError: 'DBinserting', text: 'Error inserting to database!'});
				connectionEnd(connection, id);
			}
		}
	});
});

module.exports = router;
