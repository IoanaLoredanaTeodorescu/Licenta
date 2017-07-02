var express = require('express');
var router = express.Router();
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

function searchIfExist(id, array) {
    var k = 0;
    for(var i = 0; i < array.length; i++) {
        if(array[i] === id) {
            return true;
        }
    }
    return false;
}

router.get('/:email', function(req, res) {

    var email = req.params.email;

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

    connection.query('SELECT * FROM reviews WHERE author_email=\"' + email +'\";', (err, result) => {
	    if(err) {
			console.log('Error searching in database! \nExecution stopped! \n' + 'Error message: ' + err.message);
			res.json({typeError: 'DBselect', text: 'Error searching in database! \nExecution stopped! \n' + 'Error message: ' + err.message});
			connectionEnd(connection, id);
	    } else {
			if(result.length > 0) {
				var array = [];
	            array.push(result[0].id);
	            for(var i = 1; i < result.length; i++) {
	                if(array.includes(result[i].id) === false) {
	                    array.push(result[i].id);
	                }
	            }
	            console.log(array)
	            res.json({typeError: 'NoError', text: 'My restaurants', message: array});
	            connectionEnd(connection, id);
			} else {
				res.json({typeError: 'Error', text: 'My restaurants', message: 'Nu există reviews!'});
			   connectionEnd(connection, id);
			}

	    }
	});
});

module.exports = router;
