var fs = require('fs');
var mysql = require('mysql');

var id = null;

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
				console.log('Error creating tables! \nExecution stopped! \n' + 'Error message: ' + err.message);
				closeConnection(connection, id);
				process.exit();
			} else {
				console.log('Tables created!');
			}
		});

		script = fs.readFileSync('./scripts/insert_datas_into_restaurant.sql').toString();

		connection.query(script, (err) => {
			if (err) {
				console.log('Error inserting datas into restaurants! \nExecution stopped! \n' + 'Error message: ' + err.message);
				closeConnection(connection, id);
				process.exit();
			} else {
				console.log('Datas inserted into restaurants!');
			}
		});

		script = fs.readFileSync('./scripts/insert_datas_into_tag.sql').toString();

		connection.query(script, (err) => {
			if (err) {
				console.log('Error inserting datas into tags! \nExecution stopped! \n' + 'Error message: ' + err.message);
				closeConnection(connection, id);
				process.exit();
			} else {
				console.log('Datas inserted into tags!');
			}
		});

		connection.end((err) => {
			if(err) {
				console.log('Error disconnecting from database! \nExecution stopped! \n' + 'Error message: ' + err.message);
				process.exit();
			}
			console.log('Connection with id: ' + id + ' disconected!');
		});
	}
}
