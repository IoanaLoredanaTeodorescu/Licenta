'use strict';

var fs = require('fs');
var mysql = require('mysql');

var id = null;

var messages = [];

function connectionEnd(conn, id) {
	conn.end((err) => {
		if(err) {
			console.log('Error disconnecting from database! \nExecution stopped! \n' + 'Error message: ' + err.message);
			res.json({typeError: 'DBdisconnect', text: 'Error disconnecting from database! \nExecution stopped! \n' + 'Error message: ' + err.message});
		}
		console.log('Connection with id: ' + id + ' disconected!');
	});
}

module.exports={
	initDatabase: () => {
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

		let script = fs.readFileSync('./scripts/init_database.sql').toString();

		connection.query(script, (err) => {
			if (err) {
				console.log('Error creating table! \nExecution stopped! \n' + 'Error message: ' + err.message);
				connectionEnd(connection, id);
				process.exit();
			} else {
				console.log('Table created!');
			}
		});

		script = fs.readFileSync('./scripts/insert_datas_into_restaurant.sql').toString();

		if(script.split("").length > 0) {
			connection.query(script, (err) => {
				if (err) {
					console.log('Error inserting datas into restaurants! \nExecution stopped! \n' + 'Error message: ' + err.message);
					connectionEnd(connection, id);
					process.exit();
				} else {
					console.log('Datas inserted into restaurants!');
				}
			});
		} else {
			console.log('Error inserting datas into restaurants! \nExecution stopped! \n' + 'Error message: EMPTY STRING' );
			connectionEnd(connection, id);
		}

		script = fs.readFileSync('./scripts/insert_datas_into_reviews.sql').toString();

		if(script.split("").length > 0) {
			connection.query(script, (err) => {
				if (err) {
					console.log('Error inserting in review table! \nExecution stopped! \n' + 'Error message: ' + err.message);
					connectionEnd(connection, id);
					process.exit();
				} else {
					console.log('Data inserted for table review!');
				}
			});
		} else {
			console.log('Error inserting datas into reviews! \nExecution stopped! \n' + 'Error message: EMPTY STRING' );
			connectionEnd(connection, id);
		}

		script = fs.readFileSync('./scripts/insert_datas_into_photos.sql').toString();

		if(script.split("").length > 0) {
			connection.query(script, (err) => {
				if (err) {
					console.log('Error inserting in photos table! \nExecution stopped! \n' + 'Error message: ' + err.message);
					connectionEnd(connection, id);
					process.exit();
				} else {
					console.log('Data inserted for table photos!');
					connectionEnd(connection, id);
				}
			});
		} else {
			console.log('Error inserting datas into photos! \nExecution stopped! \n' + 'Error message: EMPTY STRING' );
			connectionEnd(connection, id);
		}
	},

	getMessages: () => {
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


		connection.query('SELECT message FROM reviews', (err, result) => {
			if (err) {
				console.log('Error creating table! \nExecution stopped! \n' + 'Error message: ' + err.message);
				connectionEnd(connection, id);
				process.exit();
			} else {
				for(var i = 0; i < result.length; i++) {
					messages.push(result[i].message);
				}
				console.log(messages)
				connectionEnd(connection, id);
			}
		});
	},

	updateDatabase: () => {

	}
}
