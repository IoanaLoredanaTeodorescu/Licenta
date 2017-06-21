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

router.get('/', function(req, res) {
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


    connection.query('SELECT * FROM restaurants ORDER BY rating DESC', (err, result) => {
		var results = null;
	    if(err) {
			console.log('Error searching in database! \nExecution stopped! \n' + 'Error message: ' + err.message);
			res.json({typeError: 'DBselect', text: 'Error searching in database! \nExecution stopped! \n' + 'Error message: ' + err.message});
			connectionEnd(connection, id);
	    } else {
			results = result.length;
			if(results > 0) {
                 var obj_response = [];
                 for(var i=0; i < result.length; i++) {
                     var obj = {};
                     obj.id = result[i].id;
                     obj.name = result[i].name;
                     obj.address = result[i].address;
                     obj.lat = result[i].lat;
                     obj.lng = result[i].lng;
					 obj.tags = result[i].tags;
					 obj.phone = result[i].phone;
					 obj.opening_hours = result[i].opening_hours;
					 obj.raiting = result[i].rating;
                     obj_response.push(obj);
                 }
                res.json({typeError: 'NoError', text: 'All restaurants', message: obj_response});
                connectionEnd(connection, id);
			} else {
				res.json({typeError: 'DBinsert', text: 'Error searching in database! \nExecution stopped! \n', message: 'Nu există restaurante in baza de date!'});
				connectionEnd(connection, id);
			}
	    }
	});
});

module.exports = router;
