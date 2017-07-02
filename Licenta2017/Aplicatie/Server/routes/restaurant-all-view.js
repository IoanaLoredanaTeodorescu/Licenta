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

router.get('/:id', function(req, res) {

    var id_restaurant = req.params.id;

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

    connection.query('SELECT * FROM reviews WHERE id=\"' + id_restaurant +'\" ORDER BY credibility_score DESC;', (err, result) => {
	    if(err) {
			console.log('Error searching in database! \nExecution stopped! \n' + 'Error message: ' + err.message);
			res.json({typeError: 'DBselect', text: 'Error searching in database! \nExecution stopped! \n' + 'Error message: ' + err.message});
			connectionEnd(connection, id);
	    } else {
             var obj_response = [];
             for(var i=0; i < result.length; i++) {
                 var obj = {};
                 obj.author_name = result[i].author_name;
                 obj.profile_photo_url = result[i].profile_photo_url;
                 obj.rating = result[i].rating;
                 obj.time = result[i].time;
                 obj.message = result[i].message;
                 obj.credibility_score = result[i].credibility_score;
                 obj_response.push(obj);

             }
            res.json({typeError: 'NoError', text: 'All restaurants', message: obj_response});
            connectionEnd(connection, id);
	    }
	});
});

module.exports = router;
