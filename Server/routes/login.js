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
		password = req.body.password;

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


	connection.query('SELECT * FROM users WHERE email=\"'+email+'\" AND password=\"'+ password +'\"', (err, result, fields) => {
		var results = null;
	    if(err) {
			console.log('Error searching in database! \nExecution stopped! \n' + 'Error message: ' + err.message);
			res.json({typeError: 'DBselect', text: 'Error searching in database! \nExecution stopped! \n' + 'Error message: ' + err.message});
			connectionEnd(connection, id);
	    } else {
			results = result.length;
			if(results === 0) {
                res.json({typeError: 'NoExists', text: 'Error searching in database! \nExecution stopped! \n', message: 'Nu exista contul cu acest email și această parolă!'});
				connectionEnd(connection, id);
			} else {
				if(results === 1) {
                    res.json({typeError: 'NoError', text: 'This account is valid!', message: result[0]});
    				connectionEnd(connection, id);
                }
			}
	    }
	});
});

module.exports = router;
