var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var id = null,
	idToIsert = null;
const saltRounds = 10;

function connectionEnd(conn, id) {
	conn.end((err) => {
		if(err) {
			console.log('Error disconnecting from database! \nExecution stopped! \n' + 'Error message: ' + err.message);
			res.json({typeError: 'DBdisconnect', text: 'Error disconnecting from database! \nExecution stopped! \n' + 'Error message: ' + err.message});
		}
		console.log('Connection with id: ' + id + ' disconected!');
	});
}

function createId() {
	var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var id = '';
    for (var i = 0; i < 16; i++) {
      id += chars[Math.round(Math.random() * (chars.length - 1))];
    }
	return id;
}


function searchId(connection, token ,id) {
	connection.query('SELECT id FROM users WHERE id=\"' + token + '\"', (err, result) => {
		if(err) {
			console.log('Error searching in database! \nExecution stopped! \n' + 'Error message: ' + err.message);
			res.json({typeError: 'DBselect', text: 'Error searching in database! \nExecution stopped! \n' + 'Error message: ' + err.message});
			connectionEnd(connection, id);
		} else {
			if(result.length === 0){
				return 0;
			} else {
				return 1;
			}
		}
	});
}

/* GET users listing. */
router.post('/', (req, res, next) => {

// 	bcrypt.hash('myPlaintextPassword', 10, function(err, hash) {
//   // Store hash in your password DB.
//   console.log(hash);
//   var hashs=hash;
// });
// bcrypt.compare('myPlaintextPassword', hashs, function(err, res) {
//     // res == true
// 	console.log(res);
// });
	//console.log(req.body);
	var fullNameValue = req.body.fullName,
		emailValue = req.body.email,
		passwordValue = req.body.password;

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


	connection.query('SELECT email FROM users WHERE email=\"'+emailValue+'\"', (err, result, fields) => {
		var results = null;
	    if(err) {
			console.log('Error searching in database! \nExecution stopped! \n' + 'Error message: ' + err.message);
			res.json({typeError: 'DBselect', text: 'Error searching in database! \nExecution stopped! \n' + 'Error message: ' + err.message});
			connectionEnd(connection, id);
	    } else {
			results = result.length;
			if(results === 0) {
				var idToken = createId();
				while(searchId(connection, idToken, id) === 1) {
					idToken = createId();
				}
				connection.query('INSERT INTO users(id, fullname, email, password) VALUES(\"'+idToken+'\",\"'+fullNameValue+'\",\"'+emailValue+'\",\"'+passwordValue+'\");', (err, result) => {
					if(err) {
						console.log('Error insering in database! \nExecution stopped! \n' + 'Error message: ' + err.message);
						res.json({typeError: 'DBinserting', text: 'Error inserting to database!', message: 'Eroare la crearea contului!'});
						connectionEnd(connection, id);
					} else {
						if(result.affectedRows === 1) {
							res.json({typeError: 'NoError', text: 'Inserted in DB!', message: 'Contul a fost creat!'});
							connection.end();
						} else {
							res.json({typeError: 'DBinserting', text: 'Error inserting to database!'});
							connectionEnd(connection, id);
						}
					}
				});

			} else {
				res.json({typeError: 'DBinsert', text: 'Error searching in database! \nExecution stopped! \n', message: 'Email-ul există deja!'});
				connectionEnd(connection, id);
			}
	    }
	});
});

module.exports = router;
